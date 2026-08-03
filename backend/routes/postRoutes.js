import Router from 'express';
import passport from "../authUtils.js"
import { checkUser } from '../utils.js';
import { deleteComment, deletePost, getAllPosts, getCommentsOfPost, getPostById, likePost, makeComment, makePost, removeLike, updatePost } from '../controllers/postController.js';

const postRouter = Router();


postRouter.post("/", passport.authenticate('jwt', { session: false }), checkUser, makePost);
postRouter.get("/", checkUser, getAllPosts);
postRouter.get("/:postId", getPostById);
postRouter.put("/:postId", checkUser, updatePost);
postRouter.delete("/:postId", checkUser, deletePost);

postRouter.post("/:postId/likes", checkUser, likePost);
postRouter.delete("/:postId/likes", checkUser, removeLike);

postRouter.post("/:postId/comments", checkUser, makeComment);
postRouter.get("/:postId/comments", checkUser, getCommentsOfPost);
postRouter.delete("/comments/:commentId", checkUser, deleteComment);


export default postRouter;