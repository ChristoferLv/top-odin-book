import { prisma } from "../lib/prisma.js";

async function getMyNotificationsCount(req, res) {
    try {
        const count = await prisma.notifications.count({
            where: {
                receiverId: req.user.id,
                readAt: null
            }
        })

        return res.status(200).send({ success: true, data: count });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
        throw e;
    }
}

async function getMyNotifications(req, res) {
    try {
        const notifications = await prisma.notifications.findMany({
            where: { receiverId: req.user.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true
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
            orderBy: { createdAt: "desc" }
        });

        return res.status(200).send({ success: true, data: notifications });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
        throw e;
    }
}

async function markNotificationsAsRead(req, res) {
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

            console.log("deleting olds", deletingResult);

            const setRead = await tx.notifications.updateManyAndReturn({
                where: {
                    receiverId: req.user.id
                },
                data: {
                    read: true,
                    readAt: new Date()
                }
            });
            console.log("setted as read", setRead);
        });

        return res.status(204);
    } catch (e) {
        console.log(e);
    }
}


export {
    getMyNotificationsCount,
    getMyNotifications,
    markNotificationsAsRead
}