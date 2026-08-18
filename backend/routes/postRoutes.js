import Router from 'express';
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { bookmarkPost, deletePost, deleteReplie, getAllPosts, getBookmarkedPosts, getLikedPosts, getMyReplies, getPostById, getRepliesOfPost, getSharedPosts, likePost, makePost, makeReplie, removeLike, removePostBookmark, sharePost, updatePost } from '../controllers/postController.js';

const postRouter = Router();





postRouter.get("/likes", passport.authenticate('jwt', { session: false }), checkUser, getLikedPosts)
postRouter.post("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, likePost);
postRouter.delete("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, removeLike);

postRouter.post("/:postId/shares", passport.authenticate('jwt', { session: false }), checkUser, sharePost);
postRouter.get("/shares", passport.authenticate('jwt', { session: false }), checkUser, getSharedPosts);

postRouter.post("/:postId/replies", passport.authenticate('jwt', { session: false }), checkUser, makeReplie);
postRouter.get("/:postId/replies", passport.authenticate('jwt', { session: false }), checkUser, getRepliesOfPost);
postRouter.delete("/replies/:commentId", passport.authenticate('jwt', { session: false }), checkUser, deleteReplie);
postRouter.get("/replies", passport.authenticate('jwt', { session: false }), checkUser, getMyReplies);

postRouter.get("/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, getBookmarkedPosts)
postRouter.post("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, bookmarkPost);
postRouter.delete("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, removePostBookmark);

postRouter.post("/", passport.authenticate('jwt', { session: false }), checkUser, makePost);
postRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getAllPosts);
postRouter.get("/:postId",passport.authenticate('jwt', { session: false }), getPostById);
postRouter.put("/:postId", checkUser, updatePost);
postRouter.delete("/:postId", checkUser, deletePost);


export default postRouter;