import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { PostType, USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, removeBookmarkPost, sharePost, unsharePost } from "../../api/requests";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ReplyDialog from "./ReplyDialog";
import ShareOrReplyDialog from "./ShareOrReplyDialog";
import ShareWithComment from "./ShareWithReplyDialog";
import PostMidia from "./PostMidia";
import DeletePostBalloon from "./DeletePostBalloon";
import { FeedContext } from "../FeedContext";

function PostWithComment({ user, data, onPostPage }) {
    const [postData, setPostData] = useState(data);
    const [isMeShare, setIsMeShare] = useState(data.postType == PostType.SHARE && data.author.id == user.id);
    const [isOriginalPostDialogOpen, setisOriginalPostDialogOpen] = useState(false);
    const [isReplyPostDialogOpen, setisReplyPostDialogOpen] = useState(false);
    const [isShareOrReplyOpen, setIsShareOrReplyOpen] = useState(0);
    const [isOriginalShareDialogOpen, setisOriginalShareDialogOpen] = useState(false);
    const [isReplyShareDialogOpen, setisReplyShareDialogOpen] = useState(false);
    const [isShareOrReplyPosition, setIsShareOrReplyPosition] = useState({});
    const { deletePost } = useContext(FeedContext);



    const navigate = useNavigate();
    const originalPostData = postData.originalPost;
    const originalHasMidia = originalPostData.hasMidia;
    const replyHasMidia = postData.hasMidia;
    const isReply = data.postType == PostType.REPLY;
    const isShare = data.postType == PostType.SHARE;
    // const isMeShare = data.postType == PostType.SHARE && data.author.id == user.id;
    const usePostData = isReply ? postData.originalPost : postData;
    const formatedDate = formatDate(postData.createdAt);

    const isOriginalMy = data.originalPost.authorId == user.id;
    const isReplyMy = data.authorId == user.id;
    const [showDeleteBalloon, setShowDeleteBalloon] = useState(0);
    const moreBtnRefOriginal = useRef(null);
    const moreBtnRefReply = useRef(null);
    const [isReplyDeleted, setIsReplyDeleted] = useState(data.deleted);
    const [isOriginalDeleted, setIsOriginalDeleted] = useState(data.originalPost.deleted);

    async function handleLike(e, onOriginal) {
        e.stopPropagation();
        const postId = onOriginal ? originalPostData.id : postData.id;
        if ((onOriginal && originalPostData.likes.length) || (!onOriginal && postData.likes.length)) {
            const result = await dislikePost(postId);
            if (result && result.success) {
                if (onOriginal) {
                    setPostData({ ...postData, originalPost: { ...originalPostData, likes: [], _count: { ...postData.originalPost._count, likes: originalPostData._count.likes - 1 } } });
                } else {
                    setPostData({ ...postData, likes: [], _count: { ...postData._count, likes: postData._count.likes - 1 } });
                }
            }
            return;
        }

        const result = await likePost(postId);
        if (result && result.success) {
            if (onOriginal) {
                setPostData({ ...postData, originalPost: { ...originalPostData, likes: [{ id: result.data.id }], _count: { ...postData.originalPost._count, likes: originalPostData._count.likes + 1 } } });
            } else {
                setPostData({ ...postData, likes: [{ id: result.data.id }], _count: { ...postData._count, likes: postData._count.likes + 1 } });
            }
        }
    }

    async function handleShare(e, onOriginal) {
        const postId = onOriginal ? originalPostData.id : postData.id;
        const hasShared = onOriginal ? originalPostData.shares.length : postData.shares.length;
        if (hasShared) {
            const result = await unsharePost(postId);
            if (result && result.success) {
                if (onOriginal) {
                    setPostData({ ...postData, originalPost: { ...postData.originalPost, shares: [], _count: { ...postData.originalPost._count, shares: originalPostData._count.shares - 1 } } });
                } else {
                    setPostData({ ...postData, shares: [], _count: { ...postData._count, shares: postData._count.shares - 1 } });
                }
            }
            return;
        }

        const result = await sharePost(postId);
        if (result && result.success) {
            if (onOriginal) {
                setPostData({ ...postData, originalPost: { ...originalPostData, shares: [{ id: result.data.id }], _count: { ...postData.originalPost._count, shares: originalPostData._count.shares + 1 } } });
            } else {
                setPostData({ ...postData, shares: [{ id: result.data.id }], _count: { ...postData._count, shares: postData._count.shares + 1 } });
            }
        }
    }

    async function handleBookmark(e, onOriginal) {
        e.stopPropagation();
        const postId = onOriginal ? originalPostData.id : postData.id;
        const hasBookmarked = onOriginal ? originalPostData.bookmarks.length : postData.bookmarks.length;
        if (hasBookmarked) {
            const result = await removeBookmarkPost(postId);
            if (result && result.success) {
                if (onOriginal) {
                    setPostData({ ...postData, originalPost: { ...originalPostData, bookmarks: [] } });
                } else {
                    setPostData({ ...postData, bookmarks: [] });
                }
            }
            return;
        }

        const result = await bookmarkPost(postId);
        if (result && result.success) {
            if (onOriginal) {
                setPostData({ ...postData, originalPost: { ...originalPostData, bookmarks: [{ id: result.data.id }] } });
            }
            else {
                setPostData({ ...postData, bookmarks: [{ id: result.data.id }] });
            }
        }
    }

    function openShareOrReply(e, onOriginal) {
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
        if (onOriginal) {
            // if (originalPostData.shares.length) {
            //     handleShare(e, onOriginal);
            //     return;
            // }
            setIsShareOrReplyOpen(1);
        }

        if (!onOriginal) {
            // if (postData.shares.length) {
            //     handleShare(e, onOriginal);
            //     return;
            // }
            setIsShareOrReplyOpen(2);
        }
    }

    function selectShare(e) {
        e.stopPropagation();
        handleCloseDialog(e);
        if (isShareOrReplyOpen == 1) {
            handleShare(e, true);
        }
        if (isShareOrReplyOpen == 2) {
            handleShare(e, false);
        }
    }

    function handleReply(e, onOriginal) {
        e.stopPropagation();
        handleCloseDialog(e);
        if (onOriginal) {
            setisOriginalPostDialogOpen(true);
        } else {
            setisReplyPostDialogOpen(true);
        }
    }

    function handleShareReplyDialog(e) {
        e.stopPropagation();
        if (isShareOrReplyOpen == 1) {
            setisOriginalShareDialogOpen(true);
        }
        if (isShareOrReplyOpen == 2) {
            setisReplyShareDialogOpen(true);
        }
        setIsShareOrReplyOpen(0);
    }

    function successReply() {
        if (isOriginalPostDialogOpen) {
            setPostData({ ...postData, originalPost: { ...postData.originalPost, shares: [], _count: { ...postData.originalPost._count, replyPost: originalPostData._count.replyPost + 1 } } });
        } else {
            setPostData({ ...postData, _count: { ...postData._count, replyPost: postData._count.replyPost + 1 } });
        }
        handleCloseDialog();
    }

    function successShareReply() {
        if (isOriginalShareDialogOpen) {
            setPostData({ ...postData, originalPost: { ...postData.originalPost, shares: [], _count: { ...postData.originalPost._count, shares: originalPostData._count.shares + 1 } } });
        } else {
            setPostData({ ...postData, _count: { ...postData._count, shares: postData._count.shares + 1 } });

        }
        handleCloseDialog();
    }

    function handleCloseDialog(e) {
        // e.stopPropagation();
        setisOriginalPostDialogOpen(false);
        setisReplyPostDialogOpen(false);
        setisOriginalShareDialogOpen(false);
        setisReplyShareDialogOpen(false);
        setIsShareOrReplyOpen(0);
    };

    function handleSeePost(onOriginal) {
        if (onOriginal)
            navigate(`/${originalPostData.author.username}/post/${originalPostData.id}`);
        else
            navigate(`/${postData.author.username}/post/${postData.id}`);
    }

    function handleSeeAuthor(e, onOriginal) {
        e.stopPropagation();
        if (onOriginal)
            navigate(`/${originalPostData.author.username}`);
        else
            navigate(`/${postData.author.username}`);
    }

    function goToPicturePage(e, onOriginal) {
        if (onOriginal)
            navigate(`/${originalPostData.author.username}/post/${originalPostData.id}/photo`);
        else
            navigate(`/${postData.author.username}/post/${postData.id}/photo`);
    }

    function handleMoreButton(e, onOriginal) {
        e.stopPropagation();
        if (showDeleteBalloon != 0) {
            setShowDeleteBalloon(0);
            return;
        }
        if (onOriginal) {
            setShowDeleteBalloon(1);
        } else {
            setShowDeleteBalloon(2);
        }
    }

    function onDelete() {
        const postId = showDeleteBalloon == 1 ? data.originalPost.id : data.id;
        const originalDeleted = showDeleteBalloon == 1;
        deletePost(postId, originalDeleted);

        if (showDeleteBalloon == 1) {
            setIsOriginalDeleted(true);
        }
        if (showDeleteBalloon == 2) {
            setIsReplyDeleted(true);
        }
        if (onPostPage && showDeleteBalloon == 2) {
            navigate(-1);
            return;
        }
        setShowDeleteBalloon(0);
    }

    // useEffect(() => {
    //     const handleEsc = (event) => {
    //         if (event.key === 'Escape') {
    //             console.log("called here")
    //             handleCloseDialog(event);
    //         }
    //     };
    //     window.addEventListener('keydown', handleEsc);

    //     return () => {
    //         window.removeEventListener('keydown', handleEsc);
    //     };
    // }, []);

    if (isReplyDeleted) return null;

    return (
        <>
            <div className="post-with-comment">
                {!isOriginalDeleted && <div className="original-post post" onClick={() => handleSeePost(true)}>
                    {/* <div className="chain"></div> */}
                    <div className="post-body">
                        <div className="left-side">
                            <UserPicture id={originalPostData.author.id} username={originalPostData.author.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                            <div className="chain"></div>
                        </div>
                        <div className="post-data">
                            <div className="post-head" onClick={(e) => { handleSeeAuthor(e, true) }}>
                                <span>{originalPostData.author.name}</span>
                                <span>@{originalPostData.author.username} - {formatedDate}</span>
                                {showDeleteBalloon == 1 && <DeletePostBalloon isOpen={showDeleteBalloon} postId={postData.id} onDelete={onDelete} onClose={handleMoreButton} postRef={moreBtnRefOriginal} />}
                                {isOriginalMy && <div className="more-button" onClick={(e) => handleMoreButton(e, true)} ref={moreBtnRefOriginal} >
                                    <div className="more-button-inner">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                                        </svg>
                                    </div>
                                </div>}
                            </div>
                            <div className="post-content">
                                {originalPostData.content?.length > 0 && <textarea readOnly defaultValue={originalPostData.content}></textarea>}
                                {originalHasMidia && <PostMidia postId={originalPostData.id} dimensions={originalPostData.dimensions} seePhoto={(e) => goToPicturePage(e, true)} />}
                            </div>
                            <div className="post-controls">
                                <div className="controll-wrapper">
                                    <div onClick={(e) => handleReply(e, true)} className="comment-control-button">
                                        <div className="icon-box">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                            </svg>
                                        </div>
                                        <p>{originalPostData._count.replyPost}</p>
                                    </div>
                                </div>
                                <div className="controll-wrapper">
                                    <div onClick={(e) => openShareOrReply(e, true)} className={`share-control-button ${originalPostData.shares.length ? "active" : ""}`}>
                                        <div className="icon-box">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                            </svg>
                                        </div>
                                        <p>{originalPostData._count.shares}</p>
                                        {isShareOrReplyOpen == 1 && <ShareOrReplyDialog onClose={handleCloseDialog} position={isShareOrReplyPosition} shared={originalPostData.shares.length} isOpen={isShareOrReplyOpen == 1} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                                    </div>
                                </div>
                                <div className="controll-wrapper">
                                    <div onClick={(e) => handleLike(e, true)} className={`like-control-button no-fill ${originalPostData.likes.length ? "active" : ""}`}>
                                        <div className="icon-box">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                            </svg>
                                        </div>
                                        <p>{originalPostData._count.likes}</p>
                                    </div>
                                </div>
                                <div className="controll-wrapper">
                                    <div onClick={(e) => handleBookmark(e, true)} className={`bookmark-control-button no-fill ${originalPostData.bookmarks.length ? "active" : ""}`}>
                                        <div className="icon-box">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {!isReplyDeleted && <div className="replying-post-container">
                    <div className="top-space">
                        <div className="chain-box">
                            <div className="chain"></div>
                        </div>
                        <div className="space"></div>
                    </div>
                    <div className="replying-post post" onClick={() => handleSeePost(false)}>
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
                            <UserPicture id={postData.author.id} username={postData.author.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                            <div className="post-data">
                                <div className="post-head" onClick={(e) => { handleSeeAuthor(e, false) }}>
                                    <span>{postData.author.name}</span>
                                    <span>@{postData.author.username} - {formatedDate}</span>
                                    {showDeleteBalloon == 2 && <DeletePostBalloon isOpen={showDeleteBalloon} postId={postData.id} onDelete={onDelete} onClose={handleMoreButton} postRef={moreBtnRefReply} />}
                                    {isReplyMy && <div className="more-button" onClick={(e) => handleMoreButton(e, false)} ref={moreBtnRefReply} >
                                        <div className="more-button-inner">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                                            </svg>
                                        </div>
                                    </div>}
                                </div>
                                <div className="post-content">
                                    {postData.content?.length > 0 && <textarea readOnly defaultValue={postData.content}></textarea>}
                                    {replyHasMidia && <PostMidia postId={postData.id} dimensions={postData.dimensions} seePhoto={(e) => goToPicturePage(e, false)} />}
                                </div>
                                <div className="post-controls">
                                    <div className="controll-wrapper">
                                        <div onClick={(e) => handleReply(e, false)} className="comment-control-button">
                                            <div className="icon-box">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                                </svg>
                                            </div>
                                            <p>{postData._count.replyPost}</p>
                                        </div>
                                    </div>
                                    <div className="controll-wrapper">
                                        <div onClick={(e) => openShareOrReply(e, false)} className={`share-control-button ${postData.shares.length ? "active" : ""}`}>
                                            <div className="icon-box">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                    <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                                                </svg>
                                            </div>
                                            <p>{postData._count.shares}</p>
                                            {isShareOrReplyOpen == 2 && <ShareOrReplyDialog onClose={handleCloseDialog} position={isShareOrReplyPosition} shared={postData.shares.length} isOpen={isShareOrReplyOpen == 2} selectShare={selectShare} selectShareReply={handleShareReplyDialog} />}
                                        </div>
                                    </div>
                                    <div className="controll-wrapper">
                                        <div onClick={(e) => handleLike(e, false)} className={`like-control-button no-fill ${postData.likes.length ? "active" : ""}`}>
                                            <div className="icon-box">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                    <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                                </svg>
                                            </div>
                                            <p>{postData._count.likes}</p>
                                        </div>
                                    </div>
                                    <div className="controll-wrapper">
                                        <div onClick={(e) => handleBookmark(e, false)} className={`bookmark-control-button no-fill ${postData.bookmarks.length ? "active" : ""}`}>
                                            <div className="icon-box">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                                    <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <ReplyDialog isOpen={isOriginalPostDialogOpen} originalPost={originalPostData} user={user} onCancel={handleCloseDialog} onConfirm={successReply} />
            <ReplyDialog isOpen={isReplyPostDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={successReply} />
            <ShareWithComment isOpen={isOriginalShareDialogOpen} originalPost={originalPostData} user={user} onCancel={handleCloseDialog} onConfirm={successShareReply} />
            <ShareWithComment isOpen={isReplyShareDialogOpen} originalPost={postData} user={user} onCancel={handleCloseDialog} onConfirm={successShareReply} />
        </>
    );
}




export default PostWithComment;