import { Router } from "express";
import { followUser, getAllUsers, getBackground, getPicture, getUserById, getUserByUsername, searchUsers, unfollowUser, updateUserProfile, uploadBackground, uploadPicture } from "../controllers/usersController.js";
import { passport } from "../authUtils.js";
import { checkUser } from "../utils.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRoutes = Router();



userRoutes.post("/:userId/follows", passport.authenticate('jwt', { session: false }), checkUser, followUser);
userRoutes.delete("/:userId/follows", passport.authenticate('jwt', { session: false }), checkUser, unfollowUser);

userRoutes.get("/picture/:userId", passport.authenticate('jwt', { session: false }), checkUser, getPicture);
userRoutes.post("/picture", upload.single("picture"), passport.authenticate('jwt', { session: false }), checkUser, uploadPicture);

userRoutes.get("/background/:userId", passport.authenticate('jwt', { session: false }), checkUser, getBackground);
userRoutes.post("/background", upload.single("background"), passport.authenticate('jwt', { session: false }), checkUser, uploadBackground);

userRoutes.get("/search", passport.authenticate('jwt', { session: false }), searchUsers);
userRoutes.get("/find/:username", passport.authenticate('jwt', { session: false }), getUserByUsername);
userRoutes.get("/:userId", passport.authenticate('jwt', { session: false }), getUserById);
userRoutes.get("/", passport.authenticate('jwt', { session: false }), getAllUsers);
userRoutes.put("/", passport.authenticate('jwt', { session: false }), checkUser, updateUserProfile);

export default userRoutes;