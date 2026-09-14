import { Router } from "express";
import { followUser, getAllUsers, getBackground, getPicture, getUserById, getUserByUsername, removeBackground, removePicture, searchUsers, unfollowUser, updateUserProfile, uploadBackground, uploadPicture } from "../controllers/usersController.js";
import { passport } from "../authUtils.js";
import { checkUser } from "../utils.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = Router();



userRouter.post("/:userId/follows", passport.authenticate('jwt', { session: false }), checkUser, followUser);
userRouter.delete("/:userId/follows", passport.authenticate('jwt', { session: false }), checkUser, unfollowUser);

userRouter.get("/picture/:userId", passport.authenticate('jwt', { session: false }), checkUser, getPicture);
userRouter.post("/picture", upload.single("picture"), passport.authenticate('jwt', { session: false }), checkUser, uploadPicture);
userRouter.delete("/picture", passport.authenticate('jwt', { session: false }), checkUser, removePicture);

userRouter.get("/background/:userId", passport.authenticate('jwt', { session: false }), checkUser, getBackground);
userRouter.post("/background", upload.single("background"), passport.authenticate('jwt', { session: false }), checkUser, uploadBackground);
userRouter.delete("/background", passport.authenticate('jwt', { session: false }), checkUser, removeBackground);

userRouter.get("/search", passport.authenticate('jwt', { session: false }), searchUsers);
userRouter.get("/find/:username", passport.authenticate('jwt', { session: false }), getUserByUsername);
userRouter.get("/:userId", passport.authenticate('jwt', { session: false }), getUserById);
userRouter.get("/", passport.authenticate('jwt', { session: false }), getAllUsers);
userRouter.put("/", passport.authenticate('jwt', { session: false }), checkUser, updateUserProfile);

export default userRouter;