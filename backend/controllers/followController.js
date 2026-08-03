import { prisma } from "../lib/prisma.js";

function followUser(req, res) {
    try {
        const userToFollowId = parseInt(req.params.userId);

        const exists = await prisma.users.findUnique({
            where: {
                id: userToFollowId
            }
        });

        if (!exists) {
            return res.status(400).send({ success: false, message: "User not found." });
        }

        const alreadyFollowing = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: req.user.id,
                    followingId: userToFollowId
                }
            }
        });

        if (alreadyFollowing)
            return res.status(400).send({ success: false, message: "You already follow this user." });

        const result = await prisma.follows.create({
            data: {
                followedBy: req.user.id,
                following: userToFollowId
            }
        });

        if (!result)
            return res.status(500).send({ success: false });

        return res.status(201).send({ success: true, data: result })
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function unfollowUser(req, res) {
    try {
        const userTounfollowId = parseInt(req.params.userId);

        const following = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: req.user.id,
                    followingId: userTounfollowId
                }
            }
        });

        if (!following)
            return res.status(400).send({ success: false, message: "You do not follow this user." });

        const result = await prisma.follows.delete({
            where: {
                followedBy: req.user.id,
                following: userTounfollowId
            }
        });

        if (!result)
            return res.status(500).send({ success: false });

        return res.status(200).send({ success: true })
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function removeFollower(req, res) {
    try {
        const userId = parseInt(req.params.userId);

        const following = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: userId,
                    followingId: req.user.id
                }
            }
        });

        if (!following)
            return res.status(400).send({ success: false, message: "This user does not follow you." });

        const result = await prisma.follows.delete({
            where: {
                followedBy: userId,
                following: req.user.id
            }
        });

        if (!result)
            return res.status(500).send({ success: false });

        return res.status(200).send({ success: true })
    } catch (e) {
        console.log(e);
        throw e;
    }
}


export{
    followUser,
    unfollowUser,
    removeFollower
}