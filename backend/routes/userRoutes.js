import { Router } from "express";
import { findUserByUsername, getAllUsers, getUserById, updateUserProfile } from "../controllers/usersController.js";
import { passport } from "../authUtils.js";


const userRoutes = Router();


userRoutes.get("/", passport.authenticate('jwt', { session: false }), getAllUsers);
userRoutes.get("/:userId", passport.authenticate('jwt', { session: false }), getUserById);
userRoutes.put("/", passport.authenticate('jwt', { session: false }), updateUserProfile);
userRoutes.get("/find/:username", passport.authenticate('jwt', { session: false }), findUserByUsername);

export default userRoutes;