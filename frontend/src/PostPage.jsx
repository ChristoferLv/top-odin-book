import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "./AuthContext";
import { formatDate } from "./utils/dateUtils";
import { bookmarkPost, dislikePost, fetchPostById, fetchRepliesOfPost, likePost, makeReply, removeBookmarkPost, sharePost, unsharePost } from "../api/requests";
import UserPicture from "./components/UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "./utils/defaults";
import Post from "./components/Post";
import Comment from "./components/Comment";
import ReplyDialog from "./components/ReplyDialog";
import ShareWithReply from "./components/ShareWithReplyDialog";
import ShareOrReplyDialog from "./components/ShareOrReplyDialog";
import PostMidia from "./components/PostMidia";
import MakeReply from "./components/MakeReply";
import PostWithComment from "./components/PostWithComment";
import LoadingSpinner from "./components/LoadingSpinner";
import DeletePostBalloon from "./components/DeletePostBalloon";
import { FeedContext } from "./FeedContext";
import { ToastContext } from "./ToastsContext";

function PostPage() {
    const { user, isLoading } = useContext(AuthContext);
    const { deletePost } = useContext(FeedContext);
    const { addToast } = useContext(ToastContext);
    const { username, postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [postData, setPostData] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [commentsList, setCommentsList] = useState([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isShareOrReplyOpen, setIsShareOrReplyOpen] = useState(false);
    const [isShareOrReplyPosition, setIsShareOrReplyPosition] = useState({});

    const isMyPost = postData?.authorId == user?.id;
    const [showDeleteBalloon, setShowDeleteBalloon] = useState(false);
    const moreBtnRef = useRef(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const [replies, setReplies] = useState([]);


    const hasShared = postData?.shares.length;
    const hasMidia = postData?.hasMidia;

    const numLikes = postData?._count.likes;
    const numShares = postData?._count.shares;
    const numReplies = postData?._count.replyPost;

    // const fetchReplies = useCallback(async () => {
    //     try {
    //         const result = await fetchRepliesOfPost(postId);
    //         if (result && result.success) {
    //             setCommentsList(result.data);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, [location.pathname]);

    function adjustPostDate(date) {
        const day = date.toDateString().split(" ").slice(1).join(" ");
        const hour = date.toLocaleTimeString().split(":").slice(0, -1).join(":");
        return `${hour} · ${day}`;
    }

    function updateReplies(data, top) {
        if (top) {
            setReplies((c) => [data, ...c]);
        } else {
            setReplies((c) => [...c, ...data]);
        }
    }

    useEffect(() => {
        async function getPostData() {
            const result = await fetchPostById(postId);
            if (result && result.success) {
                setPostData(result.data);
            }
        }
        getPostData();
    }, [location.pathname]);

    // useEffect(() => {
    //     fetchReplies();
    // }, [location.pathname])


    // useEffect(() => {
    //     document.getElementById("master-pane").scrollTo(0, 0);
    // }, [location.pathname]);

    function goToPostAuthor() {
        navigate("/" + postData.author.username);
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
                addToast("Removed from the bookmarks");
                setPostData({ ...postData, bookmarks: [] });
            }
            return;
        }

        const result = await bookmarkPost(postData.id);
        if (result && result.success) {
            addToast("Post added to the bookmarks");
            setPostData({ ...postData, bookmarks: [{ id: result.data.id }] });
        }
    }

    function handleReply(e) {
        e.stopPropagation();
        setIsDialogOpen(true);
    }

    function handleCloseDialog() {
        // e.stopPropagation();
        setIsDialogOpen(false);
        setIsShareDialogOpen(false);
        setIsShareOrReplyOpen(false);
    };

    function successShareReply(e) {
        // fetchReplies();
        setPostData({ ...postData, _count: { ...postData._count, shares: numShares + 1 } });
        handleCloseDialog(e);
    }

    function openShareOrReply(e) {
        e.stopPropagation();
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        const position = {
            top: 0,
            right: 0
        }

        if ((window.innerHeight - rect.bottom) < 90) {
            position.top = -75;
        }

        setIsShareOrReplyPosition(position);

        // if (hasShared) {
        //     handleShare(e);
        //     return;
        // }
        setIsShareOrReplyOpen(true);
    }

    function selectShare(e) {
        e.stopPropagation();
        handleCloseDialog(e);
        handleShare();
    }

    function handleShareReplyDialog(e) {
        e.stopPropagation();
        handleCloseDialog(e);
        setIsShareDialogOpen(true);
    }

    function handleSuccessReply(result) {
        setPostData({ ...postData, _count: { ...postData._count, replyPost: numReplies + 1 } });
        updateReplies(result, true);
        // fetchReplies();
    }

    function goToPicturePage() {
        navigate(`/${postData.author.username}/post/${postData.id}/photo`);
    }

    function handleMoreButton(e) {
        e.stopPropagation();
        setShowDeleteBalloon(c => !c);
    }

    function onDelete() {
        setIsDeleted(true);
        deletePost(postData.id, false);
        navigate(-1);
    }

    if (!postData) return <><div className="loading">
        <p>&nbsp;</p>
    </div></>;

    if (postData.postType == "REPLY") return (<>
        <div key={postData.id} className="post-page">
            <div className="my-page-header">
                <div className="my-page-top">
                    <div onClick={() => navigate(-1)} className="my-page-back-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                        </svg>
                        <div className="tooltip">
                            Back
                        </div>
                    </div>
                    <p>Post</p>
                </div>
            </div>
            <PostWithComment data={postData} user={user} onPostPage={true} />
            <div className="post-view">
                <MakeReply postId={postData.id} onSuccess={handleSuccessReply} />
            </div>

            <InfiniteRepliesList postId={postData.id} user={user} key={location.pathname} replies={replies} updateReplies={updateReplies} />

            {/* <div className="comments-list">
                {commentsList.map((comment) => {
                    return <Post key={comment.id} data={comment} user={user} />
                })}
            </div> */}
        </div>


    </>);

    return (
        <>
            <div className="post-page">
                <div className="my-page-header">
                    <div className="my-page-top">
                        <div onClick={() => navigate(-1)} className="my-page-back-button">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                            </svg>
                            <div className="tooltip">
                                Back
                            </div>
                        </div>
                        <p>Post</p>
                    </div>
                </div>
                <div className="post-view">
                    <div className="post-view-head" onClick={goToPostAuthor}>
                        <UserPicture key={postData.author.id} id={postData.author.id} username={postData.author.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                        <div className="post-view-user-data">
                            <span>{postData.author.name}</span>
                            <span>@{postData.author.username}</span>
                        </div>
                        {showDeleteBalloon && <DeletePostBalloon isOpen={showDeleteBalloon} postId={postData.id} onDelete={onDelete} onClose={handleMoreButton} postRef={moreBtnRef} />}
                        {isMyPost && <div className="more-button" onClick={handleMoreButton} ref={moreBtnRef} >
                            <div className="more-button-inner">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                                </svg>
                            </div>
                        </div>}
                    </div>
                    <div className="post-view-data">
                        <div className="post-content">
                            {postData.content?.length > 0 && <textarea readOnly defaultValue={postData.content}></textarea>}
                            {hasMidia && <PostMidia postId={postData.id} seePhoto={goToPicturePage} dimensions={postData.dimensions} />}
                        </div>
                        <div className="post-hour">
                            {adjustPostDate(new Date(postData.createdAt))}
                        </div>
                    </div>
                    <div className="controls-separator"></div>
                    <div className="post-controls">
                        <div onClick={handleReply} className="comment-control-button">
                            <div className="icon-box">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                </svg>
                            </div>
                            <p>{numReplies}</p>
                        </div>
                        <div className="controll-wrapper">
                            <div onClick={openShareOrReply} className={`share-control-button ${hasShared ? "active" : ""}`}>
                                <div className="icon-box">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                    </svg>
                                </div>
                                <p>{numShares}</p>
                                {isShareOrReplyOpen && <ShareOrReplyDialog position={isShareOrReplyPosition} shared={hasShared} isOpen={isShareOrReplyOpen} onClose={handleCloseDialog} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                            </div>
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

                    <MakeReply postId={postData.id} onSuccess={handleSuccessReply} />
                </div>

                <InfiniteRepliesList postId={postData.id} user={user} key={location.pathname} replies={replies} updateReplies={updateReplies} />

                {/* <div className="comments-list">
                    {commentsList.map((comment) => {
                        return <Post key={comment.id} data={comment} user={user} />
                    })}
                </div> */}
            </div>
            {isDialogOpen && <ReplyDialog isOpen={isDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />}
            {isShareDialogOpen && <ShareWithReply isOpen={isShareDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={successShareReply} />}
        </>
    )
}



function InfiniteRepliesList({ user, postId, replies, updateReplies }) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getReplies(page) {
            if (loading) return;
            setLoading(true);

            try {
                const result = await fetchRepliesOfPost(postId, controller.signal, page);
                if (result && result.success) {
                    if (ignore) return;
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        updateReplies(result.data, false);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        getReplies(page);

        return () => { ignore = true; controller.abort("abort") };
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && replies.length != 0) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading]);

    return (
        <>
            <div className="comments-list">
                {replies.map((reply) => {
                    return <Post key={reply.id} data={reply} user={user} />
                })}
            </div>
            <div ref={observerTarget} style={{ height: "20px", width: "100%", backgroundColor: "red" }}>
                {loading && <LoadingSpinner />}
                {!hasMore && <p>No more items to load.</p>}
            </div>
        </>
    );
}



export default PostPage;