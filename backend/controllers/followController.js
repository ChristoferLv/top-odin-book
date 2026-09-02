import { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

async function getWhoToFollow(req, res) {
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
        SELECT "public"."Users"."id", "public"."Users"."username", "public"."Users"."name" 
        FROM "public"."Users" 
        WHERE "public"."Users"."id" NOT IN (${Prisma.join(followingIds)})
        ORDER BY RANDOM() ASC LIMIT 3`;

    if (!result)
        return res.status(500).send({ success: false });

    return res.status(200).send({ success: true, data: result });
}

export {
    getWhoToFollow
}