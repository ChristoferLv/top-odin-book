import { Router } from "express";
import { getFollowersOfUser, getWhoToFollow, getWhoUserIsFollowing, removeFollower } from "../controllers/followController.js";
import { passport } from "../authUtils.js";
import { checkUser } from "../utils.js";

const followRouter = Router();

followRouter.delete("/remove/:userId", passport.authenticate('jwt', { session: false }), checkUser, removeFollower);

followRouter.get("/:username/following", passport.authenticate('jwt', { session: false }), checkUser, getWhoUserIsFollowing);
followRouter.get("/:username/followers", passport.authenticate('jwt', { session: false }), checkUser, getFollowersOfUser);
followRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getWhoToFollow);

export default followRouter;