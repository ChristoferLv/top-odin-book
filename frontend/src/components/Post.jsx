import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { PostType, USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, removeBookmarkPost, sharePost, unsharePost } from "../../api/requests";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReplyDialog from "./ReplyDialog";
import ShareWithComment from "./ShareWithReplyDialog";
import ShareOrReplyDialog from "./ShareOrReplyDialog";
import PostMidia from "./PostMidia";

function Post({ user, data }) {
    const [postData, setPostData] = useState(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isShareOrReplyOpen, setIsShareOrReplyOpen] = useState(false);
    const navigate = useNavigate();
    const isShare = data.postType == PostType.SHARE;
    const usePostData = isShare ? postData.originalPost : postData;
    const hasShared = usePostData.replyPost.length;
    const hasMidia = usePostData.hasMidia;
    const formatedDate = formatDate(postData.createdAt);

    async function handleLike(e) {
        e.stopPropagation();
        if (usePostData.likes.length) {
            const result = await dislikePost(usePostData.id);
            if (result && result.success) {
                if (isShare) {
                    setPostData({ ...postData, originalPost: { ...postData.originalPost, likes: [] } });
                } else {
                    setPostData({ ...postData, likes: [] });
                }
            }
            return;
        }

        const result = await likePost(usePostData.id);
        if (result && result.success) {
            if (isShare) {
                setPostData({ ...postData, originalPost: { ...postData.originalPost, likes: [{ id: result.data.id }] } });
            } else {
                setPostData({ ...postData, likes: [{ id: result.data.id }] });
            }
        }
    }

    async function handleShare(e) {
        // e.stopPropagation();
        console.log("selected share")
        if (hasShared) {
            console.log("unsharing")
            const result = await unsharePost(usePostData.id);
            if (result && result.success) {
                if (isShare) {
                    setPostData({ ...postData, originalPost: { ...postData.originalPost, replyPost: [] } });
                } else {
                    setPostData({ ...postData, replyPost: [] });
                }
            }
            return;
        }

        const result = await sharePost(usePostData.id);
        if (result && result.success) {
            if (isShare) {
                setPostData({ ...postData, originalPost: { ...postData.originalPost, replyPost: [{ id: result.data.id }] } });
            } else {
                setPostData({ ...postData, replyPost: [{ id: result.data.id }] });
            }
        }
    }

    async function handleBookmark(e) {
        e.stopPropagation();
        if (usePostData.bookmarks.length) {
            const result = await removeBookmarkPost(usePostData.id);
            if (result && result.success) {
                setPostData({ ...usePostData, bookmarks: [] });
            }
            return;
        }

        const result = await bookmarkPost(usePostData.id);
        if (result && result.success) {
            setPostData({ ...usePostData, bookmarks: [{ id: result.data.id }] });
        }
    }

    function handleReply(e) {
        e.stopPropagation();
        setIsDialogOpen(true);
    }

    function handleCloseDialog(e) {
        e.stopPropagation();
        setIsDialogOpen(false);
        setIsShareDialogOpen(false);
        setIsShareOrReplyOpen(false);
    };

    function openShareOrReply(e) {
        e.stopPropagation();
        if (hasShared) {
            handleShare(e);
            return;
        }
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

    function handleSeePost() {
        navigate(`/${usePostData.author.username}/post/${usePostData.id}`);
    }

    function handleSeeAuthor(e) {
        e.stopPropagation();
        navigate(`/${usePostData.author.username}`);
    }

    function goToPicturePage() {
        navigate(`/${usePostData.author.username}/post/${usePostData.id}/photo`);
    }

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleCloseDialog(event);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    return (
        <>
            <div className="post" onClick={handleSeePost}>
                {isShare && < div className="shared-header">
                    <div className="share-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                            <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                        </svg>
                    </div>
                    <p>{postData.author.name} shared</p>
                </div>
                }
                <div className="post-body">
                    <div className="pic-space" onClick={handleSeeAuthor}>
                        <UserPicture id={usePostData.author.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                    </div>
                    <div className="post-data">
                        <div className="post-head" onClick={handleSeeAuthor}>
                            <span>{usePostData.author.name}</span>
                            <span>@{usePostData.author.username} • {formatedDate}</span>
                        </div>
                        {/* {isReply && <div><p>Original post: {usePostData.originalPostId}</p></div>} */}
                        <div className="post-content">
                            <textarea readOnly defaultValue={usePostData.content}></textarea>
                            {hasMidia && <PostMidia postId={usePostData.id} seePhoto={goToPicturePage} />}
                        </div>
                        <div className="post-controls">
                            <div onClick={handleReply} className="comment-control-button">
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                    </svg>
                                </div>
                            </div>
                            <div onClick={openShareOrReply} className={`share-control-button ${hasShared ? "active" : ""}`}>
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                    </svg>
                                </div>
                                {isShareOrReplyOpen && <ShareOrReplyDialog onClose={handleCloseDialog} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                            </div>
                            <div onClick={handleLike} className={`like-control-button no-fill ${usePostData.likes.length ? "active" : ""}`}>
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                    </svg>
                                </div>
                            </div>
                            <div onClick={handleBookmark} className={`bookmark-control-button no-fill ${usePostData.bookmarks.length ? "active" : ""}`}>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ReplyDialog isOpen={isDialogOpen} originalPost={usePostData} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />
            <ShareWithComment isOpen={isShareDialogOpen} originalPost={usePostData} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />
        </>
    )
}






export default Post;