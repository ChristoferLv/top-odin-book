import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";

async function getAllUsers(req, res) {
    try {
        const users = await prisma.users.findMany({
            omit: {
                created_at: true, password: true, mime: true
            }
        });

        res.status(200).send({ success: true, data: users });
    } catch (e) {
        console.log(e);
    }
}

async function findUserByUsername(req, res) {
    if (!req.user) {
        return res.status(401).send({ success: false });
    }

    const { username } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { username: username },
            omit: {
                password: true, picture: true, mime: true
            }
        });

        if (!user)
            return res.status(400).send({ success: false, message: "No contact found with requested username." })

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
                password: true, picture: true, mime: true
            }
        });

        if (!user)
            return res.status(200).send({ success: false, data: null })

        res.status(200).send({ success: true, data: user });
    } catch (e) {
        console.log(e);
    }
}

const updateUserProfile = [
    async (req, res) => {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ success: false, error: errors });
        // }

        if (!req.user) {
            return res.status(401).send({ success: false });
        }

        console.log("editando")

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


export {
    getAllUsers,
    findUserByUsername,
    getUserById,
    updateUserProfile,
}