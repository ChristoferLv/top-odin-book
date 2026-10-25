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
    }
}

async function markNotificationsAsRead(req, res) {
    const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setMinutes(sevenDaysAgo.getMinutes() - 2); //Simbolic time used just for demo and testing


    try {
        const result = await prisma.$transaction(async (tx) => {
            const deletingResult = await tx.notifications.deleteMany({
                where: {
                    receiverId: req.user.id,
                    readAt: { lt: sevenDaysAgo, not: null }
                }
            });

            const setRead = await tx.notifications.updateManyAndReturn({
                where: {
                    receiverId: req.user.id,
                    readAt: null
                },
                data: {
                    read: true,
                    readAt: new Date()
                }
            });
        });

        return res.status(204);
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false });
    }
}


export {
    getMyNotificationsCount,
    getMyNotifications,
    markNotificationsAsRead
}