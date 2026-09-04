import { Router } from "express";
import { getMe, login, logOut, register } from "../controllers/authController.js";
import passport from "passport";
import { checkUser } from "../utils.js";


const authRouter = Router();

authRouter.get("/me", passport.authenticate('jwt', { session: false }), checkUser, getMe);
authRouter.post("/login", login);
authRouter.post("/logout", passport.authenticate('jwt', { session: false }), checkUser, logOut);
authRouter.post("/signup", register);


export default authRouter;
