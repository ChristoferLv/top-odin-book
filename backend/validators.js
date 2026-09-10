import { body } from "express-validator";
import { prisma } from './lib/prisma.js';


export const validateNewUser = [
    body("username").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and _")
        .trim()
        .isLength({ min: 1 }).withMessage("Username must have at leats 1 characteres")
        .isLength({ max: 15 }).withMessage("The maximum username length is 15")
        .custom(async value => {
            try {
                const exists = await prisma.users.findFirst({ where: { username: { equals: value.toLowerCase(), mode: 'insensitive' } } });
                if (exists)
                    throw new Error("Username is already in use");
                return true;
            } catch (e) {
                console.log(e);
                throw e;
            }
        }).withMessage("Username is already in use"),
    body("name").trim()
        .isLength({ min: 1 }).withMessage("Name must have at least 1 characteres")
        .isLength({ max: 50 }).withMessage("The maximum name length is 50"),
    body("password")
        .trim()
        .isLength({ min: 3 }).withMessage("Password must have at leats 3 characteres")
        .isLength({ max: 50 }).withMessage("The maximum password length is 50"),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage("Password fields must match"),
    body("picture").custom((value, { req }) => {
        if (req.file && req.file.size > 5000000) {
            throw new Error("Maximum file size if 5MB.");
        }
        if (!req.file && value.length < 1)
            throw new Error("Minimum message length is 1 character.");
        return true;
    })
];


export const validateUpdateUser = [
    body("name").trim()
        .isLength({ min: 1 }).withMessage("Name must have at least 1 characteres")
        .isLength({ max: 50 }).withMessage("The maximum name length is 50"),
    body("bio")
        .trim()
        .optional({ values: 'null' })
        .isLength({ max: 160 }).withMessage("The maximum bio length is 160"),
];




export const validatePost = [
    body("content")
        .trim()
        .custom((value, { req }) => {
            if (req.file && req.file.size > 5000000) {
                throw new Error("Maximum file size if 5MB.");
            }
            if (!req.file && value.length < 1)
                throw new Error("Minimum message length is 1 character.");
            return true;
        })
        .isLength({ min: 1 }).withMessage("Post must have at leats 1 characteres of content.")
        .isLength({ max: 280 }).withMessage("The maximum post content length is 280.")
];
