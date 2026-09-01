import { Router } from "express";
import { getWhoToFollow } from "../controllers/followController.js";
import { passport } from "../authUtils.js";
import { checkUser } from "../utils.js";

const followRouter = Router();

followRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getWhoToFollow);

export default followRouter;