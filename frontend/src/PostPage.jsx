import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "./AuthContext";
import { formatDate } from "./utils/dateUtils";
import { dislikePost, fetchPostById, fetchRepliesOfPost, likePost, makeReplie } from "../api/requests";
import UserPicture from "./components/UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "./utils/defaults";
import Post from "./components/Post";
import Comment from "./components/Comment";

function PostPage() {
    const { user, isLoading } = useContext(AuthContext);
    const { username, postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [postData, setPostData] = useState(null);
    const [replieContent, setReplieContent] = useState("");
    const [commentsList, setCommentsList] = useState([]);
    
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

    function adjustPostDate(date) {
        const day = date.toDateString().split(" ").slice(1).join(" ");
        const hour = date.toLocaleTimeString().split(":").slice(0, -1).join(":");
        return `${hour} · ${day}`;
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

    useEffect(() => {
        fetchReplies();
    }, [location.pathname])

    function goToPostAuthor() {
        navigate("/" + postData.author.username);
    }

    function handleReplieChange(e) {
        setReplieContent(e.target.value);
    }

    async function postReplie() {
        const result = await makeReplie({ content: replieContent }, postId);
        if (result.success) {
            setReplieContent("");
            fetchReplies();
        }
    }

    async function handleLike() {
        if (postData.likes.length) {
            const result = await dislikePost(postData.id);
            if (result && result.success) {
                setPostData({ ...postData, likes: [] });
            }
            return;
        }

        const result = await likePost(postData.id);
        if (result && result.success) {
            setPostData({ ...postData, likes: [{ id: result.data.id }] });
        }
    }

     async function handleShare(e) {
        e.stopPropagation();
        if (isMeShare) {
            const result = await unsharePost(usePostData.id);
            if (result && result.success) {
                setIsMeShare(false);
            }
            return;
        }

        const result = await sharePost(usePostData.id);
        if (result && result.success) {
            setIsMeShare(true);
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

    if (!postData) return <><div className="loading">
        <p>&nbsp;</p>
    </div></>;

    const formatedDate = formatDate(postData.createdAt);
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
                        <UserPicture id={postData.author.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                        <div className="post-view-user-data">
                            <span>{postData.author.name}</span>
                            <span>@{postData.author.username}</span>
                        </div>
                    </div>
                    <div className="post-view-data">
                        <div className="post-content">{postData.content}</div>
                        <div className="post-hour">
                            {adjustPostDate(new Date(postData.createdAt))}
                        </div>
                    </div>
                    <div className="controls-separator"></div>
                    <div className="post-controls">
                        <div className="comment-control-button">
                            <div>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                </svg>
                            </div>
                        </div>
                        <div onClick={handleShare} className="share-control-button">
                            <div>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                </svg>
                            </div>
                        </div>
                        <div onClick={handleLike} className={`like-control-button no-fill ${postData.likes.length ? "active" : ""}`}>
                            <div>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                </svg>
                            </div>
                        </div>
                        <div onClick={handleBookmark} className={`bookmark-control-button no-fill ${postData.bookmarks.length ? "active" : ""}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                            </svg>
                        </div>
                    </div>
                    <div className="controls-separator"></div>

                    <div className="make-comment">
                        <UserPicture id={user.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                        <textarea name="" id="" value={replieContent} onChange={handleReplieChange}></textarea>
                        <button onClick={postReplie} className="post-comment">Replie</button>
                    </div>
                </div>

                <div className="comments-list">
                    {commentsList.map((comment) => {
                        return <Comment key={comment.id} data={comment} user={user} />
                    })}
                </div>
            </div>
        </>
    )
}





export default PostPage;