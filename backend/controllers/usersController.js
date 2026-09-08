import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { validateUpdateUser } from "../validators.js";

async function createNotificationAndNotify(req, authorId, receiverId) {
    try {
        const exists = await prisma.notifications.findFirst({
            where: {
                authorId: authorId,
                postId: null,
                type: "FOLLOW",
                receiverId: receiverId
            }
        });

        if (exists) return;

        const notificationResult = await prisma.notifications.create({
            data: {
                authorId: authorId,
                postId: null,
                type: "FOLLOW",
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

async function getAllUsers(req, res) {
    const userId = req.user.id;
    try {
        const users = await prisma.users.findMany({
            where: { NOT: { id: userId } },
            select: {
                id: true,
                username: true,
                name: true,
                following: { where: { followedById: userId, }, select: { id: true } }
            }
        });

        res.status(200).send({ success: true, data: users });
    } catch (e) {
        console.log(e);
    }
}

async function getUserByUsername(req, res) {
    const { username } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { username: username },
            // omit: {
            //     password: true, picture: true, mime: true, background: true, bgmime: true
            // },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                createdAt: true,
                following: { select: { id: true }, where: { followedById: req.user.id } },
                _count: {
                    /*Here what it is counting is the number of entries on the tabble "Follows" 
                        where the number of following is the id of the current user got on where
                        and where the id on followdBy is the id of the current user got on where
                        so on following shows the number of times the current user is followed
                        and on followedBy shows the number of times the current user is following someone
                        the confusion is caused by the name of the columns
                    */
                    select: {
                        following: true,
                        followedBy: true,
                        posts:true
                    }
                }
            }
        });

        if (!user)
            return res.status(400).send({ success: false, message: "No user found with requested username." })

        res.status(200).send({ success: true, data: user });
    } catch (e) {
        console.log(e);
    }
}

async function getUserById(req, res) {
    if (!req.user) {
        return res.status(401).send({ success: false });
    };

    const userId = parseInt(req.params.userId);
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            omit: {
                password: true, picture: true, mime: true, background: true, bgmime: true
            }
        });

        if (!user)
            return res.status(200).send({ success: false, data: null })

        res.status(200).send({ success: true, data: user });
    } catch (e) {
        console.log(e);
    }
}

async function searchUsers(req, res) {
    const userId = req.user.id;
    const searchTerm = req.query.q || "";
    const onlyFollowing = req.query.pf == "on";

    try {
        if (onlyFollowing) {
            const users = await prisma.follows.findMany({
                where: {
                    followedById: req.user.id,
                    following: {
                        OR: [
                            { username: { contains: searchTerm, mode: "insensitive" } },
                            { name: { contains: searchTerm, mode: "insensitive" } }
                        ]
                    }
                },
                select: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            following: { where: { followedById: userId, }, select: { id: true } }
                        }
                    }
                }
            });

            return res.status(200).send({ success: true, data: users });
        }

        const users = await prisma.users.findMany({
            where: {
                NOT: { id: userId },
                OR: [
                    { username: { contains: searchTerm, mode: "insensitive" } },
                    { name: { contains: searchTerm, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                username: true,
                name: true,
                following: { where: { followedById: userId, }, select: { id: true } }
            }
        });

        res.status(200).send({ success: true, data: users });
    } catch (e) {
        console.log(e);
    }
}

const updateUserProfile = [
    validateUpdateUser,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors });
        }

        const { name, bio } = req.body;
        const userId = parseInt(req.user.id);

        try {
            const user = await prisma.users.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(400).send({ success: false });
            }

            const result = await prisma.users.update({
                where: { id: userId },
                data: { name: name, bio: bio },
                select: { name: true, bio: true, id: true, username: true }
            })

            return res.status(200).send({ success: true, data: result });
        } catch (e) {
            console.log(e);
        }
    }
];

async function followUser(req, res) {
    const toFollow = parseInt(req.params.userId);

    if (req.user.id == toFollow)
        return res.status(400).send({ success: false, message: "You cannot follow yourself." });

    const alreadyFollowing = await prisma.follows.findUnique(
        {
            where: {
                followingId_followedById: {
                    followedById: req.user.id,
                    followingId: toFollow
                }
            }
        }
    );

    if (alreadyFollowing) {
        return res.status(409).send({ success: false, message: "You already follow this user." });
    }

    const result = await prisma.follows.create({
        data: {
            followedById: req.user.id,
            followingId: toFollow
        }
    });

    if (!result) {
        return res.status(500).send({ success: false });
    }

    createNotificationAndNotify(req, req.user.id, toFollow);

    return res.status(201).send({ success: true, data: result });
}

async function unfollowUser(req, res) {
    const toUnfollow = parseInt(req.params.userId);

    if (req.user.id == toUnfollow)
        return res.status(400).send({ success: false, message: "You cannot unfollow yourself." });

    const ifFollowing = await prisma.follows.findUnique(
        {
            where: {
                followingId_followedById: {
                    followedById: req.user.id,
                    followingId: toUnfollow
                }
            }
        }
    );

    if (!ifFollowing) {
        return res.status(400).send({ success: false, message: "You do not follow this user." });
    }

    const result = await prisma.follows.delete({
        where: {
            followingId_followedById: {
                followedById: req.user.id,
                followingId: toUnfollow
            }
        }
    });

    return res.status(200).send({ success: true });
}

async function getPicture(req, res) {
    const userId = parseInt(req.params.userId);
    const result = await prisma.users.findUnique(
        { where: { id: userId }, select: { picture: true, mime: true } }
    );
    let newbuffer = null;
    if (result.picture)
        newbuffer = Buffer.from(result.picture, result.picture.byteOffset, result.picture.byteLength)

    res.status(200).send({ success: true, data: { buffer: newbuffer, mime: result.mime } });
}

async function uploadPicture(req, res) {
    try {
        const userId = req.user.id;
        const mime = req.file.mimetype;

        if (!mime.startsWith("image/"))
            return res.status(400).send({ success: false, message: "Invalid file type." });

        if (req.file.size > 5000000) {
            return res.status(400).send({ success: false, message: "Maximum picture file size is 5MB." });
        }

        const result = await prisma.users.update(
            {
                data: { picture: req.file.buffer, mime: mime },
                where: { id: userId }
            }
        );
        let newbuffer = null;
        if (result.picture)
            newbuffer = Buffer.from(result.picture, result.picture.byteOffset, result.picture.byteLength)
        return res.status(201).send({ success: true, data: newbuffer });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false });
    }
}

async function getBackground(req, res) {
    const userId = parseInt(req.params.userId);
    const result = await prisma.users.findUnique(
        { where: { id: userId }, select: { background: true, mime: true } }
    );
    let newbuffer = null;
    if (result.background)
        newbuffer = Buffer.from(result.background, result.background.byteOffset, result.background.byteLength)

    res.status(200).send({ success: true, data: { buffer: newbuffer, mime: result.mime } });
}

async function uploadBackground(req, res) {
    try {
        const userId = req.user.id;
        const mime = req.file.mimetype;

        if (!mime.startsWith("image/"))
            return res.status(400).send({ success: false, message: "Invalid file type." });

        if (req.file.size > 5000000) {
            return res.status(400).send({ success: false, message: "Maximum background file size is 5MB." });
        }

        const result = await prisma.users.update(
            {
                data: { background: req.file.buffer, bgmime: mime },
                where: { id: userId }
            }
        );
        let newbuffer = null;
        if (result.background)
            newbuffer = Buffer.from(result.background, result.background.byteOffset, result.background.byteLength)
        return res.status(201).send({ success: true, data: newbuffer });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false });
    }
}


export {
    getAllUsers,
    getUserByUsername,
    getUserById,
    searchUsers,
    updateUserProfile,
    followUser,
    unfollowUser,
    uploadPicture,
    getPicture,
    uploadBackground,
    getBackground
}