import { prisma } from "../lib/prisma.js";

async function getMyNotifications(req, res) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    try {

        const result = await prisma.$transaction(async (tx) => {
            const deletingResult = await tx.notifications.deleteMany({
                where: {
                    receiverId: req.user.id,
                    readAt: { lt: sevenDaysAgo, not: null }
                }
            });

            const setRead = await tx.notifications.updateMany({
                where: {
                    receiverId: req.user.id
                },
                data: {
                    read: true
                }
            });

            const notifications = await tx.notifications.findMany({
                where: { receiverId: req.user.id },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    post: {
                        select: {
                            id: true,
                            content: true,
                            postType: true
                        }
                    }
                },
            });

            console.log("found", notifications, req.user.id)

            if (!notifications)
                throw new Error("Fail to get notifications.");

            return notifications
        });

        if (!result) {
            return res.status(500).send({ success: false });
        }

        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
        throw e;
    }
}


export {
    getMyNotifications
}