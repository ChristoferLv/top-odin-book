import Router from 'express';
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { bookmarkPost, deletePost, deleteReplie, getAllPosts, getBookmarkedPosts, getLikedPosts, getMyReplies, getPostById, getPostMidia, getRepliesOfPost, getSharedPosts, getTrendingPosts, likePost, makePost, makeReply, removeLike, removePostBookmark, removeShare, searchPosts, sharePost, updatePost } from '../controllers/postController.js';
import multer from 'multer';

const postRouter = Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


postRouter.get("/trending", passport.authenticate('jwt', { session: false }), checkUser, getTrendingPosts);

postRouter.get("/likes", passport.authenticate('jwt', { session: false }), checkUser, getLikedPosts)
postRouter.post("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, likePost);
postRouter.delete("/:postId/likes", passport.authenticate('jwt', { session: false }), checkUser, removeLike);

postRouter.post("/:postId/shares", passport.authenticate('jwt', { session: false }), checkUser, sharePost);
postRouter.get("/shares", passport.authenticate('jwt', { session: false }), checkUser, getSharedPosts);
postRouter.delete("/:postId/shares", passport.authenticate('jwt', { session: false }), checkUser, removeShare);

postRouter.post("/:postId/replies", upload.single("picture"), passport.authenticate('jwt', { session: false }), checkUser, makeReply);
postRouter.get("/:postId/replies", passport.authenticate('jwt', { session: false }), checkUser, getRepliesOfPost);
postRouter.delete("/replies/:commentId", passport.authenticate('jwt', { session: false }), checkUser, deleteReplie);
postRouter.get("/replies", passport.authenticate('jwt', { session: false }), checkUser, getMyReplies);

postRouter.get("/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, getBookmarkedPosts)
postRouter.post("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, bookmarkPost);
postRouter.delete("/:postId/bookmarks", passport.authenticate('jwt', { session: false }), checkUser, removePostBookmark);

postRouter.get("/search", passport.authenticate('jwt', { session: false }), searchPosts);
postRouter.get("/:postId/midia", passport.authenticate('jwt', { session: false }), getPostMidia);
postRouter.get("/:postId", passport.authenticate('jwt', { session: false }), getPostById);
postRouter.put("/:postId", checkUser, updatePost);
postRouter.delete("/:postId", checkUser, deletePost);
postRouter.post("/", upload.single("picture"), passport.authenticate('jwt', { session: false }), checkUser, makePost);
postRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getAllPosts);


export default postRouter;