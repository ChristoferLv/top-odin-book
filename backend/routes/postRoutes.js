import Router from 'express';
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { deleteComment, deletePost, getAllPosts, getCommentsOfPost, getPostById, likePost, makeComment, makePost, removeLike, updatePost } from '../controllers/postController.js';

const postRouter = Router();





postRouter.post("/", passport.authenticate('jwt', { session: false }), checkUser, makePost);
postRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getAllPosts);
postRouter.get("/:postId", getPostById);
postRouter.put("/:postId", checkUser, updatePost);
postRouter.delete("/:postId", checkUser, deletePost);

postRouter.post("/:postId/like", passport.authenticate('jwt', { session: false }), checkUser, likePost);
postRouter.delete("/:postId/like", passport.authenticate('jwt', { session: false }), checkUser, removeLike);

postRouter.post("/:postId/comments", passport.authenticate('jwt', { session: false }), checkUser, makeComment);
postRouter.get("/:postId/comments", passport.authenticate('jwt', { session: false }), checkUser, getCommentsOfPost);
postRouter.delete("/comments/:commentId", passport.authenticate('jwt', { session: false }), checkUser, deleteComment);


export default postRouter;