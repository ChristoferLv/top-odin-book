import { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

const PAGE_SIZE = 15;

async function removeFollower(req, res) {
    try {

        const followerId = parseInt(req.params.userId);
        const userId = req.user.id;

        const isFollowing = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: followerId,
                    followingId: userId
                }
            }
        });

        if (!isFollowing) {
            return res.status(400).send({ success: false, message: "This user is not following you" });
        }

        const result = await prisma.follows.delete({
            where: {
                followingId_followedById: {
                    followedById: followerId,
                    followingId: userId
                }
            }
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(200).send({ success: true });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
    }
}

async function getWhoToFollow(req, res) {
    try {

        const following = await prisma.follows.findMany(
            {
                where: {
                    followedById: req.user.id
                },
                select: { followingId: true }
            }
        );

        const followingIds = following.map((it) => it.followingId);
        followingIds.push(req.user.id);

        const result = await prisma.$queryRaw`
        SELECT "public"."Users"."id", "public"."Users"."username", "public"."Users"."name", ARRAY[]::integer[] AS following, ARRAY[]::integer[] AS "followedBy"
        FROM "public"."Users" 
        WHERE "public"."Users"."id" NOT IN (${Prisma.join(followingIds)})
        ORDER BY RANDOM() ASC LIMIT 3`;

        if (!result)
            return res.status(500).send({ success: false });

        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
    }
}

async function getFollowersOfUser(req, res) {
    try {
        const page = req.query.page;
        const username = req.params.username;
        const userId = req.user.id;

        let toTake = {};
        if (page && page > 0) {
            toTake = { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }
        }
        const result = await prisma.follows.findMany({
            where: {
                following: {
                    username: username
                }
            },
            select: {
                followedBy: {
                    select: {
                        id: true,
                        bio: true,
                        name: true,
                        username: true,
                        following: { where: { followedById: userId, }, select: { id: true } },
                        followedBy: { where: { followingId: userId, }, select: { id: true } },
                    }
                }
            },
            ...toTake
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        const treatedResult = result.map((it) => it.followedBy);

        return res.status(200).send({ success: true, data: treatedResult });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });

    }
}

async function getWhoUserIsFollowing(req, res) {
    try {
        const page = req.query.page;
        const username = req.params.username;
        const userId = req.user.id;

        let toTake = {};
        if (page && page > 0) {
            toTake = { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }
        }

        const result = await prisma.follows.findMany({
            where: {
                followedBy: {
                    username: username
                }
            },
            select: {
                following: {
                    select: {
                        id: true,
                        bio: true,
                        name: true,
                        username: true,
                        following: { where: { followedById: userId, }, select: { id: true } },
                        followedBy: { where: { followingId: userId, }, select: { id: true } },
                    }
                }
            },
            ...toTake
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        const treatedResult = result.map((it) => it.following);

        return res.status(200).send({ success: true, data: treatedResult });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
    }
}

export {
    removeFollower,
    getWhoToFollow,
    getFollowersOfUser,
    getWhoUserIsFollowing
}