import { Router } from "express";
import { findUserByUsername, getAllUsers, getPicture, getUserById, updateUserProfile, uploadPicture } from "../controllers/usersController.js";
import { passport } from "../authUtils.js";
import { checkUser } from "../utils.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRoutes = Router();


userRoutes.get("/", passport.authenticate('jwt', { session: false }), getAllUsers);
userRoutes.get("/:userId", passport.authenticate('jwt', { session: false }), getUserById);
userRoutes.put("/", passport.authenticate('jwt', { session: false }), checkUser, updateUserProfile);
userRoutes.get("/find/:username", passport.authenticate('jwt', { session: false }), findUserByUsername);

userRoutes.get("/picture/:userId", passport.authenticate('jwt', { session: false }), checkUser, getPicture);
userRoutes.post("/picture", upload.single("picture"), passport.authenticate('jwt', { session: false }), checkUser, uploadPicture);

export default userRoutes;