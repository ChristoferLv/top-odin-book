import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";

const validatePost = [
    body("content")
        .trim()
        .isLength({ min: 1 }).withMessage("Post must have at leats 1 characteres of content.")
        .isLength({ max: 500 }).withMessage("The maximum post content length is 500.")
];

const makePost = [
    validatePost,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors });
        }

        try {
            const { content } = matchedData(req);

            const result = await prisma.posts.create({
                data: {
                    content: content,
                    authorId: req.user.id,
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

async function getAllPosts(req, res) {
    try {
        const userId = req.user.id;
        let condition = {}
        if (req.query.userId)
            condition = { authorId: parseInt(req.query.userId) };
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
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
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
                likes: { where: { whoLikedId: req.user.id }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: req.user.id }, select: { id: true } },
                _count: {
                    select: {
                        likes: {
                            where: { postId: postId }
                        },
                        bookmarks: {
                            where: { postId: postId }
                        }
                    }
                }
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



















// async function getLikedPosts(req, res) {
//     try {
//         let condition = {}
//         if (req.query.userId)
//             condition = { whoLikedId: parseInt(req.query.userId) };
//         const userId = req.user.id;
//         const result = await prisma.likes.findMany({
//             where: condition,
//             select: {
//                 post: {
//                     include: {
//                         author: {
//                             omit:
//                             {
//                                 password: true,
//                                 picture: true,
//                                 mime: true,
//                                 background: true,
//                                 bgmime: true,
//                                 createdAt: true
//                             }
//                         },
//                         likes: { where: { whoLikedId: userId }, select: { id: true } },
//                         bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
//                     }
//                 }
//             },
//         })

//         if (!result) {
//             return res.status(500).send({ success: false });
//         }

//         return res.send({ success: true, data: result });
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// }

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
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
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

        return res.send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function removeLike(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        // const exists = await prisma.posts.findUnique({
        //     where: {
        //         id: postId
        //     }
        // });

        // if (!exists) {
        //     return res.status(400).send({ success: false, message: "Post not found." });
        // }

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

// async function removeLike(req, res) {
//     try {
//         const postId = parseInt(req.params.postId);

//         // const exists = await prisma.posts.findUnique({
//         //     where: {
//         //         id: postId
//         //     }
//         // });

//         // if (!exists) {
//         //     return res.status(400).send({ success: false, message: "Post not found." });
//         // }

//         const hasLiked = await prisma.likes.findUnique({
//             where: {
//                 postId_whoLikedId: { postId: postId, whoLikedId: req.user.id }
//             }
//         });

//         if (!hasLiked)
//             return res.status(400).send({ success: false, message: "You have not liked this post." });

//         const result = await prisma.likes.delete({
//             where: {
//                 postId_whoLikedId: {
//                     postId: postId,
//                     whoLikedId: req.user.id
//                 }
//             }
//         });

//         if (!result) {
//             return res.status(500).send({ success: false });
//         }

//         return res.send({ success: true, data: result });
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// }
























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
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
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
                originalPostId_authorId_postType: {
                    originalPostId: postId,
                    authorId: req.user.id,
                    postType: "SHARE"
                }
            }
        });

        // const hasShared = await prisma.posts.findFirst({
        //     where: {
        //         originalPostId: postId,
        //         authorId: req.user.id,
        //         postType: "SHARE"
        //     }
        // })

        if (hasShared)
            return res.status(400).send({ success: false, message: "You have already shared this post." });

        const result = await prisma.posts.create({
            data: {
                authorId: req.user.id,
                postType: "SHARE",
                originalPostId: postId
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

async function removeShare(req, res) {
    try {
        const postId = parseInt(req.params.postId);

        const hasShared = await prisma.posts.findUnique({
            where: {
                originalPostId_authorId_postType: {
                    originalPostId: postId,
                    authorId: req.user.id,
                    postType: "SHARE"
                }
            }
        })

        // const hasShared = await prisma.posts.findFirst({
        //     where: {
        //         authorId: req.user.id,
        //         originalPostId: postId,
        //         postType: "SHARE"
        //     }
        // });

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



















// async function getMyComments(req, res) {
//     try {
//         const userId = req.user.id;
//         let condition = {}
//         if (req.query.userId)
//             condition = { authorId: parseInt(req.query.userId) };
//         const result = await prisma.comments.findMany({
//             where: condition,

//             include: {
//                 author: {
//                     omit:
//                     {
//                         password: true,
//                         picture: true,
//                         mime: true,
//                         background: true,
//                         bgmime: true,
//                         createdAt: true
//                     }
//                 },
//             }
//         })

//         if (!result) {
//             return res.status(500).send({ success: false });
//         }

//         return res.send({ success: true, data: result });
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// }

async function getMyReplies(req, res) {
    try {
        const userId = req.user.id;
        let condition = { postType: "REPLY" }
        if (req.query.userId)
            Object.assign(condition, { authorId: parseInt(req.query.userId) });
        console.log("condition", condition)
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
                        }
                    }
                },
                likes: { where: { whoLikedId: userId }, select: { id: true } },
                bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
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

async function makeReplie(req, res) {
    try {
        const postId = parseInt(req.params.postId);
        console.log(req.body)
        const content = req.body.content;

        const exists = await prisma.posts.findUnique({
            where: { id: postId }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "Post not found." });
        }

        const result = await prisma.posts.create(
            {
                data: {
                    content: content,
                    authorId: req.user.id,
                    postType: "REPLY",
                    originalPostId: postId
                }
            }
        );

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(201).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        throw e;
    }
}


// async function makeComment(req, res) {
//     try {
//         const postId = parseInt(req.params.postId);
//         console.log(req.body)
//         const content = req.body.content;

//         const exists = await prisma.posts.findUnique({
//             where: { id: postId }
//         });

//         if (!exists) {
//             return res.status(400).send({ success: false, message: "Post not found." });
//         }

//         const result = await prisma.comments.create({
//             data: {
//                 content: content,
//                 postId: postId,
//                 authorId: req.user.id
//             }
//         });

//         if (!result) {
//             return res.status(500).send({ success: false });
//         }

//         return res.status(201).send({ success: true, data: result });
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// }

async function getRepliesOfPost(req, res) {
    try {
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
                        bookmarks: { where: { whoBookmarkedId: userId }, select: { id: true } }
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
        console.log("postid", postId)
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

        // const exists = await prisma.posts.findUnique({
        //     where: {
        //         id: postId
        //     }
        // });

        // if (!exists) {
        //     return res.status(400).send({ success: false, message: "Post not found." });
        // }

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








export {
    makePost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,

    getLikedPosts,
    likePost,
    removeLike,

    getSharedPosts,
    sharePost,
    removeShare,

    getMyReplies,
    makeReplie,
    getRepliesOfPost,
    deleteReplie,

    getBookmarkedPosts,
    bookmarkPost,
    removePostBookmark
}