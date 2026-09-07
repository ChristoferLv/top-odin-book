import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "./AuthContext";
import { adjustPostDate, formatDate } from "./utils/dateUtils";
import { bookmarkPost, dislikePost, fetchPostById, fetchPostMidia, fetchRepliesOfPost, likePost, makeReply, removeBookmarkPost, sharePost, unsharePost } from "../api/requests";
import UserPicture from "./components/UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "./utils/defaults";
import Post from "./components/Post";
import Comment from "./components/Comment";
import ReplyDialog from "./components/ReplyDialog";
import ShareWithComment from "./components/ShareWithReplyDialog";
import ShareOrReplyDialog from "./components/ShareOrReplyDialog";
import PostMidia from "./components/PostMidia";
import MakeReply from "./components/MakeReply";

function SeeingPicturePage() {
    const { user, isLoading } = useContext(AuthContext);
    const { username, postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [postData, setPostData] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [commentsList, setCommentsList] = useState([]);

    const commentBox = useRef();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isShareOrReplyOpen, setIsShareOrReplyOpen] = useState(0);

    const [midiaBuff, setMidia] = useState(null);
    const [mime, setMime] = useState(null);

    const hasShared = postData?.shares.length;

    const rawBuffer = new Uint8Array(midiaBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);

    const numLikes = postData?._count.likes;
    const numShares = postData?._count.shares;
    const numReplies = postData?._count.replyPost;


    useEffect(() => {
        async function getMidia() {
            const midia = await fetchPostMidia(postId);
            setMidia(midia.data.content?.data);
            setMime(midia.data.mime);
        }
        getMidia();
        return () => {
            setMidia(null);
            setMime(null);
            setPostData(null);
        }
    }, [location.pathname]);


    const fetchReplies = useCallback(async () => {
        try {
            const result = await fetchRepliesOfPost(postId);
            if (result && result.success) {
                setCommentsList(result.data);
            }
        } catch (e) {
            console.log(e);
        }
    }, [location.pathname]);



    useEffect(() => {
        async function getPostData() {
            const result = await fetchPostById(postId);
            if (result && result.success) {
                setPostData(result.data);
            }
        }
        getPostData();
    }, [location.pathname]);

    useEffect(() => {
        fetchReplies();
    }, [location.pathname])

    function goToPostAuthor() {
        navigate("/" + postData.author.username);
    }

    function goBack() {
        navigate(-1);
    }

    function handleReplyChange(e) {
        setReplyContent(e.target.value);
    }

    async function postReply() {
        const result = await makeReply({ content: replyContent }, postId);
        if (result.success) {
            setReplyContent("");
            fetchReplies();
        }
    }

    async function handleLike() {
        if (postData.likes.length) {
            const result = await dislikePost(postData.id);
            if (result && result.success) {
                setPostData({ ...postData, likes: [], _count: { ...postData._count, likes: numLikes - 1 } });
            }
            return;
        }

        const result = await likePost(postData.id);
        if (result && result.success) {
            setPostData({ ...postData, likes: [{ id: result.data.id }], _count: { ...postData._count, likes: numLikes + 1 } });
        }
    }

    async function handleShare() {
        if (hasShared) {
            const result = await unsharePost(postData.id);
            if (result && result.success) {
                setPostData({ ...postData, shares: [], _count: { ...postData._count, shares: numShares - 1 } });
            }
            return;
        }

        const result = await sharePost(postData.id);
        if (result && result.success) {
            setPostData({ ...postData, shares: [{ id: result.data.id }], _count: { ...postData._count, shares: numShares + 1 } });
        }
    }

    async function handleBookmark() {
        if (postData.bookmarks.length) {
            const result = await removeBookmarkPost(postData.id);
            if (result && result.success) {
                setPostData({ ...postData, bookmarks: [] });
            }
            return;
        }

        const result = await bookmarkPost(postData.id);
        if (result && result.success) {
            setPostData({ ...postData, bookmarks: [{ id: result.data.id }] });
        }
    }

    function handleReply(e) {
        e.stopPropagation();
        commentBox.current.focus();
        // setIsDialogOpen(true);
    }

    function handleCloseDialog(e) {
        e.stopPropagation();
        setIsDialogOpen(false);
        setIsShareDialogOpen(false);
        setIsShareOrReplyOpen(0);
    };


    function successShareReply(e) {
        setPostData({ ...postData, _count: { ...postData._count, shares: numShares + 1 } });
        handleCloseDialog(e);
    }

    function openShareOrReply(e, origin) {
        e.stopPropagation();
        if (hasShared) {
            handleShare(e);
            return;
        }
        setIsShareOrReplyOpen(origin);
    }

    function selectShare(e) {
        // e.stopPropagation();
        handleCloseDialog(e);
        handleShare();
    }

    function handleShareReplyDialog(e) {
        // e.stopPropagation();
        handleCloseDialog(e);
        setIsShareDialogOpen(true);
    }

    function handleSuccessReply() {
        setPostData({ ...postData, _count: { ...postData._count, replyPost: numReplies + 1 } });
        fetchReplies();
    }

    if (!postData || !midiaBuff) return <> <div className="see-picture-page"></div></>;


    const formatedDate = formatDate(postData.createdAt);
    return (
        <>
            <div className="see-picture-page">
                <div className="main-container">
                    <div className="picture-container">
                        <button className='close-button' onClick={goBack}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-2 -2 18 18" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="white" />
                            </svg>
                        </button>
                        <div className="shown-midia">
                            <div
                                style={{ backgroundImage: `url(${imageUrl})` }}
                                className="the-img"></div>
                            {/* <img src={imageUrl} alt="" /> */}
                        </div>
                    </div>
                    <div className="main-container-controls">
                        <div onClick={handleReply} className="comment-control-button">
                            <div className="icon-box">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                </svg>
                            </div>
                            <p>{numReplies}</p>
                        </div>
                        <div onClick={(e) => { openShareOrReply(e, 1) }} className={`share-control-button ${hasShared ? "active" : ""}`}>
                            <div className="icon-box">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                </svg>
                            </div>
                            <p>{numShares}</p>
                            {isShareOrReplyOpen == 1 && <ShareOrReplyDialog onClose={handleCloseDialog} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                        </div>
                        <div onClick={handleLike} className={`like-control-button no-fill ${postData.likes.length ? "active" : ""}`}>
                            <div className="icon-box">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                </svg>
                            </div>
                            <p>{numLikes}</p>
                        </div>
                        <div onClick={handleBookmark} className={`bookmark-control-button no-fill ${postData.bookmarks.length ? "active" : ""}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="side-container">
                    <div className="actions-container">
                        <div onClick={goToPostAuthor} className="actions-container-header">
                            <UserPicture id={postData.author.id} username={postData.author.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                            <div className="actions-container-user-data">
                                <span>{postData.author.name}</span>
                                <span>@{postData.author.username}</span>
                            </div>
                        </div>
                        <div className="actions-container-post-content">
                            <div className="post-content">
                                <textarea readOnly defaultValue={postData.content}></textarea>
                            </div>
                            <div className="post-hour">
                                {adjustPostDate(new Date(postData.createdAt))}
                            </div>
                        </div>
                        <div className="controls-separator"></div>
                        <div className="actions-container-controls">
                            <div onClick={handleReply} className="comment-control-button">
                                <div className="icon-box">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                    </svg>
                                </div>
                                <p>{numReplies}</p>
                            </div>
                            <div onClick={(e) => openShareOrReply(e, 2)} className={`share-control-button ${hasShared ? "active" : ""}`}>
                                <div className="icon-box">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                    </svg>
                                </div>
                                <p>{numShares}</p>
                                {isShareOrReplyOpen == 2 && <ShareOrReplyDialog onClose={handleCloseDialog} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                            </div>
                            <div onClick={handleLike} className={`like-control-button no-fill ${postData.likes.length ? "active" : ""}`}>
                                <div className="icon-box">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                    </svg>
                                </div>
                                <p>{numLikes}</p>
                            </div>
                            <div onClick={handleBookmark} className={`bookmark-control-button no-fill ${postData.bookmarks.length ? "active" : ""}`}>
                                <div className="icon-box">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="controls-separator"></div>
                        <MakeReply postId={postData.id} onSuccess={handleSuccessReply} inputRef={commentBox} />
                    </div>
                    <div className="replies-container">
                        {commentsList.map((comment) => {
                            return <Post key={comment.id} data={comment} user={user} />
                        })}
                    </div>
                </div>
            </div>
            {isDialogOpen && <ReplyDialog isOpen={isDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />}
            {isShareDialogOpen && <ShareWithComment isOpen={isShareDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={successShareReply} />}
        </>
    );
}





export default SeeingPicturePage;