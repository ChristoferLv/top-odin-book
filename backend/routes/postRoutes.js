import Router from 'express';
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { bookmarkPost, deleteComment, deletePost, getAllPosts, getBookmarkedPosts, getCommentsOfPost, getLikedPosts, getPostById, likePost, makeComment, makePost, removeLike, removePostBookmark, updatePost } from '../controllers/postController.js';

const postRouter = Router();





postRouter.get("/likes", passport.authenticate('jwt', { session: false }), checkUser, getLikedPosts)
postRouter.post("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, likePost);
postRouter.delete("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, removeLike);

postRouter.get("/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, getBookmarkedPosts)
postRouter.post("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, bookmarkPost);
postRouter.delete("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, removePostBookmark);

postRouter.post("/:postId/comments", passport.authenticate('jwt', { session: false }), checkUser, makeComment);
postRouter.get("/:postId/comments", passport.authenticate('jwt', { session: false }), checkUser, getCommentsOfPost);
postRouter.delete("/comments/:commentId", passport.authenticate('jwt', { session: false }), checkUser, deleteComment);

postRouter.post("/", passport.authenticate('jwt', { session: false }), checkUser, makePost);
postRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getAllPosts);
postRouter.get("/:postId", getPostById);
postRouter.put("/:postId", checkUser, updatePost);
postRouter.delete("/:postId", checkUser, deletePost);


export default postRouter;