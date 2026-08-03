import { Router } from "express";
import { followUser, removeFollower, unfollowUser } from "../controllers/followController.js";


const followRouter = Router();

followRouter.post("/follow/:userId", passport.authenticate('jwt', { session: false }), checkUser, followUser);
followRouter.delete("/unfollow/:userId", passport.authenticate('jwt', { session: false }), checkUser, unfollowUser);
followRouter.delete("/remove/:userId", passport.authenticate('jwt', { session: false }), checkUser, removeFollower);


export default followRouter;