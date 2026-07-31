import { Router } from "express";
import { getMe, login, logOut, register } from "../controllers/authController.js";
import passport from "passport";


const authRouter = Router();

authRouter.get("/me", passport.authenticate('jwt', { session: false }), getMe);
authRouter.post("/login", login);
authRouter.post("/logout", passport.authenticate('jwt', { session: false }), logOut);
authRouter.post("/signup", register);


export default authRouter;
