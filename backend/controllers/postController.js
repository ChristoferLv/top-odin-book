import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { validatePost } from "../validators.js";

async function createNotificationAndNotify(req, authorId, postId, type, receiverId) {
    try {
        if (authorId == receiverId) return;

        const exists = await prisma.notifications.findUnique({
            where: {
                authorId_receiverId_postId_type: {
                    authorId: authorId,
                    postId: postId,
                    type: type,
                    receiverId: receiverId
                }
            }
        });

        if (exists) return;

        const notificationResult = await prisma.notifications.create({
            data: {
                authorId: authorId,
                postId: postId,
                type: type,
                receiverId: receiverId
            }
        });

        if (!notificationResult)
            return;

        req.socketIo.to(`user:${receiverId}`).emit("notification");

    } catch (e) {
        console.log(e);
    }
}

const makePost = [
    validatePost,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors });
        }

        try {
            const { content } = matchedData(req);
            const originalPostId = parseInt(req.body.originalPostId);

            if (originalPostId) {
                const exists = await prisma.posts.findUnique({
                    where: { id: originalPostId }
                });

                if (!exists) {
                    return res.status(400).send({ success: false, message: "Referenced psot not found" });
                }
            }

            let referenceId = originalPostId ? originalPostId : null;
            let postType = originalPostId ? "SHARE_REPLY" : "POST";
            let hasMidia = req.file?.size > 0;
            let reference = {};
            if (originalPostId) {
                reference.sharedPostId = referenceId;
                reference.originalPostId = null;
            } else {
                reference.originalPostId = referenceId;
                reference.sharedPostId = null;
            }

            const result = await prisma.$transaction(async (tx) => {
                const postResult = await tx.posts.create({
                    data: {
                        authorId: req.user.id,
                        hasMidia: hasMidia,
                        postType: postType,
                        ...reference,
                        content: content
                    }
                });

                if (!postResult) {
                    throw new Error("Fail to create new post.");
                }

                if (!hasMidia) {
                    return postResult;
                }

                const midiaResult = await tx.midias.create({
                    data: {
                        mime: req.file.mimetype,
                        content: req.file.buffer,
                        ownerId: req.user.id,
                        postId: postResult.id
                    }
                });

                if (!midiaResult)
                    throw new Error("Fail to create new post.");

                return postResult;
            });

            if (!result) {
                return res.status(500).send({ success: false });
            }

            return res.send({ success: true, data: result });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ success: false });
        }
    }
];

async function getAllPosts(req, res) {
    try {
        const userId = req.user.id;
        let condition = {}
        if (req.query.onFeed == 'true') {
            Object.assign(condition, { NOT: { AND: { authorId: userId, postType: { in: ["POST"] } } } })
        }
        if (req.query.userId) {
            Object.assign(condition, { authorId: parseInt(req.query.userId), postType: { in: ["POST", "SHARE_REPLY"] } });
        }
        const result = await prisma.posts.findMany({
            where: condition,
            include:
            {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true
                    }
                },
                midia: false,
                originalPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        }
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
                sharedPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
            },
            orderBy: { createdAt: "desc" }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getPostById(req, res) {
    try {
        if (typeof req.params.postId === 'string' && Number.isNaN(Number(req.params.postId))) {
            return res.status(400).send({ success: false });
        }

        const postId = parseInt(req.params.postId);

        const result = await prisma.posts.findUnique({
            where: {
                id: postId
            },

            include: {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true,
                    }
                },
                originalPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: req.user.id }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: req.user.id }, select: { id: true } },
                        shares: { where: { authorId: req.user.id, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                sharedPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: req.user.id }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: req.user.id }, select: { id: true } },
                        shares: { where: { authorId: req.user.id, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                likes: { where: { whoLikedId: req.user.id }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: req.user.id }, select: { id: true } },
                shares: { where: { authorId: req.user.id, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
            }

            // select: { _count: { select: { likes: true } } }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const updatePost = [
    validatePost,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors });
        }

        try {
            const postId = parseInt(req.params.id);
            const { content } = matchedData(req);

            const exists = await prisma.posts.findUnique({
                where: {
                    id: postId
                }
            });

            if (!exists) {
                return res.status(400).send({ success: false, message: "Post not found." });
            }

            const result = await prisma.posts.update({
                where: { id: postId },
                data: {
                    content: content
                }
            });

            if (!result) {
                return res.status(500).send({ success: false });
            }

            return res.send({ success: true, data: result });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
];

async function deletePost(req, res) {
    try {
        const postId = parseInt(req.params.id);

        const exists = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }

        const result = await prisma.posts.delete({
            where: {
                id: postId
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getPostMidia(req, res) {
    const postId = parseInt(req.params.postId);
    try {
        const result = await prisma.midias.findUnique({
            where: { postId: postId },
        });

        if (!result)
            return res.status(400).send({
                success: false, message: "Midia not found"
            });

        let newbuffer = null;
        if (result.content)
            newbuffer = Buffer.from(result.content, result.content.byteOffset, result.content.byteLength)
        return res.status(200).send({ success: true, data: { ...result, content: newbuffer } });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
    }
}

async function searchPosts(req, res) {
    try {
        const userId = req.user.id;
        const searchTerm = req.query.q;
        const onlyFollowing = req.query.pf == "on";

        let condition = {};
        let order = [{ likes: { _count: "desc" } }, { createdAt: "desc" }];
        if (searchTerm?.length > 0) {
            condition = { content: { contains: searchTerm, mode: "insensitive" } };
            order = [{ createdAt: "desc" }];
        }

        if (onlyFollowing) {
            const users = await prisma.follows.findMany({
                where: { followedById: req.user.id }
            });

            const usersId = users.map((i) => i.followingId);

            condition = { ...condition, "authorId": { in: usersId } };
        }

        const result = await prisma.posts.findMany({
            where: condition,
            include:
            {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true
                    }
                },
                midia: false,
                originalPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                sharedPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        midia: false,
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
            },
            orderBy: order
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getLikedPosts(req, res) {
    try {
        let condition = {}
        if (req.query.userId)
            condition = { whoLikedId: parseInt(req.query.userId) };
        const userId = req.user.id;
        const result = await prisma.likes.findMany({
            where: condition,
            select: {
                post: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
            },
            orderBy: { createdAt: "desc" }
        })

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function likePost(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const exists = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }

        const hasLiked = await prisma.likes.findUnique({
            where: {
                postId_whoLikedId: { postId: postId, whoLikedId: req.user.id }
            }
        });

        if (hasLiked)
            return res.status(400).send({ success: false, message: "You have already liked this post." });

        const result = await prisma.likes.create({
            data: {
                postId: postId,
                whoLikedId: req.user.id
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        createNotificationAndNotify(req, req.user.id, postId, "LIKE", exists.authorId);

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function removeLike(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const hasLiked = await prisma.likes.findUnique({
            where: {
                postId_whoLikedId: { postId: postId, whoLikedId: req.user.id }
            }
        });

        if (!hasLiked)
            return res.status(400).send({ success: false, message: "You have not liked this post." });

        const result = await prisma.likes.delete({
            where: {
                postId_whoLikedId: {
                    postId: postId,
                    whoLikedId: req.user.id
                }
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getSharedPosts(req, res) {
    try {
        let condition = { postType: "SHARE" }
        if (req.query.userId)
            Object.assign(condition, { authorId: parseInt(req.query.userId) });
        const userId = req.user.id;
        const result = await prisma.posts.findMany({
            where: condition,
            include: {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true
                    }
                },
                originalPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } }
                    }
                },
                sharedPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
            }
        })

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function sharePost(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const exists = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }


        const hasShared = await prisma.posts.findUnique({
            where: {
                sharedPostId_authorId_postType: {
                    sharedPostId: postId,
                    authorId: req.user.id,
                    postType: "SHARE"
                }
            }
        });

        if (hasShared)
            return res.status(400).send({ success: false, message: "You have already shared this post." });

        const result = await prisma.posts.create({
            data: {
                authorId: req.user.id,
                postType: "SHARE",
                sharedPostId: postId
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        createNotificationAndNotify(req, req.user.id, postId, "SHARE", exists.authorId);

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function removeShare(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const hasShared = await prisma.posts.findUnique({
            where: {
                sharedPostId_authorId_postType: {
                    sharedPostId: postId,
                    authorId: req.user.id,
                    postType: "SHARE"
                }
            }
        })

        if (!hasShared)
            return res.status(400).send({ success: false, message: "You have not shared this post." });

        const result = await prisma.posts.delete({
            where: {
                id: hasShared.id
            }

        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getMyReplies(req, res) {
    try {
        const userId = req.user.id;
        let condition = { postType: "REPLY" }
        if (req.query.userId)
            Object.assign(condition, { authorId: parseInt(req.query.userId) });
        const result = await prisma.posts.findMany({
            where: condition,
            include: {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true
                    }
                },
                originalPost: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
            },
            orderBy: { createdAt: "desc" }
        })

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}
const makeReply = [
    validatePost,
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors });
            }


            const postId = parseInt(req.params.postId);
            const content = req.body.content;

            const exists = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!exists) {
                return res.status(400).send({ success: false, message: "Post not found." });
            }

            let hasMidia = req.file?.size > 0;

            const result = await prisma.$transaction(async (tx) => {
                const postResult = await tx.posts.create({
                    data: {
                        authorId: req.user.id,
                        hasMidia: hasMidia,
                        postType: "REPLY",
                        originalPostId: postId,
                        content: content
                    }
                });

                if (!postResult) {
                    throw new Error("Fail to create new post.");
                }

                if (!hasMidia) {
                    return postResult;
                }

                const midiaResult = await tx.midias.create({
                    data: {
                        mime: req.file.mimetype,
                        content: req.file.buffer,
                        ownerId: req.user.id,
                        postId: postResult.id
                    }
                });

                if (!midiaResult)
                    throw new Error("Fail to create new post.");

                return postResult;
            });

            if (!result) {
                return res.status(500).send({ success: false });
            }

            createNotificationAndNotify(req, req.user.id, postId, "REPLY", exists.authorId);

            return res.status(201).send({ success: true, data: result });
        } catch (e) {
            console.log(e);
            res.status(500).send({ success: false });
            throw e;
        }
    }
]

async function getRepliesOfPost(req, res) {
    try {
        const userId = req.user.id;
        const postId = parseInt(req.params.postId);

        const exists = await prisma.posts.findUnique({
            where: { id: postId }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }

        const result = await prisma.posts.findMany({
            where: { originalPostId: postId, postType: "REPLY" },
            include: {
                author: {
                    omit:
                    {
                        password: true,
                        picture: true,
                        mime: true,
                        background: true,
                        bgmime: true,
                        createdAt: true
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                _count: {
                    select: {
                        likes: true,
                        replyPost: true,
                        shares: true
                    }
                },
            },
            orderBy: { createdAt: "desc" }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteReplie(req, res) {
    try {
        const commentId = parseInt(req.params.commentId);

        const exists = await prisma.comments.findUnique({
            where: { id: commentId }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Comment not found." });
        }

        const result = await prisma.comments.delete({
            where: { id: commentId }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(200).send({ success: true });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getBookmarkedPosts(req, res) {
    const userId = req.user.id;
    try {
        const result = await prisma.bookmarks.findMany({
            where: { whoBookmarkedId: req.user.id },
            select: {
                post: {
                    include: {
                        author: {
                            omit:
                            {
                                password: true,
                                picture: true,
                                mime: true,
                                background: true,
                                bgmime: true,
                                createdAt: true
                            }
                        },
                        likes: { where: { whoLikedId: userId }, select: { id: true } },
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } },
                        shares: { where: { authorId: userId, postType: "SHARE" }, select: { id: true } },
                        _count: {
                            select: {
                                likes: true,
                                replyPost: true,
                                shares: true
                            }
                        },
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function bookmarkPost(req, res) {
    try {
        const postId = parseInt(req.params.postId);
        const exists = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }

        const hasBookmarked = await prisma.bookmarks.findUnique({
            where: {
                postId_whoBookmarkedId: { postId: postId, whoBookmarkedId: req.user.id }
            }
        });

        if (hasBookmarked)
            return res.status(400).send({ success: false, message: "You have already bookmarked this post." });

        const result = await prisma.bookmarks.create({
            data: { postId: postId, whoBookmarkedId: req.user.id }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        throw e;
    }
}

async function removePostBookmark(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const hasBookmarked = await prisma.bookmarks.findUnique({
            where: {
                postId_whoBookmarkedId: { postId: postId, whoBookmarkedId: req.user.id }
            }
        });

        if (!hasBookmarked)
            return res.status(400).send({ success: false, message: "You have not bookmarked this post." });

        const result = await prisma.bookmarks.delete({
            where: {
                postId_whoBookmarkedId: { postId: postId, whoBookmarkedId: req.user.id }
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getTrendingPosts(req, res) {
    const timeAgo = new Date();
    timeAgo.setMinutes(timeAgo.getMinutes() - 1);
    try {
        const result = await prisma.$transaction(async (tx) => {
            const deletion = await tx.trending.deleteMany({
                where: {
                    createdAt: { lt: timeAgo }
                }
            });

            console.log("trends deleted", deletion);

            const getCurrent = await tx.trending.findMany(
                {
                    include: {
                        post: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                });
            if (getCurrent.length > 0) {
                return getCurrent;
            }

            console.log("current trends", getCurrent);

            const newTrends = await tx.posts.findMany({
                orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
                take: 3
            });

            console.log("generated new trends", newTrends);

            const newTrendsIds = newTrends.map((it) => { return { postId: it.id } });

            const saveTrends = await tx.trending.createManyAndReturn({
                data: newTrendsIds,
                include: {
                    post: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true
                                }
                            }
                        },
                    }
                }
            });
            console.log("saved new trends", saveTrends);
            return saveTrends;
        });

        if (!result)
            return res.status(500).send({ success: false });

        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}



export {
    makePost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostMidia,
    searchPosts,

    getLikedPosts,
    likePost,
    removeLike,

    getSharedPosts,
    sharePost,
    removeShare,

    getMyReplies,
    makeReply,
    getRepliesOfPost,
    deleteReplie,

    getBookmarkedPosts,
    bookmarkPost,
    removePostBookmark,

    getTrendingPosts
}