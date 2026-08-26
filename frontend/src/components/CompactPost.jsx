import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { PostType, USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, removeBookmarkPost, sharePost, unsharePost } from "../../api/requests";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReplyDialog from "./ReplyDialog";
import ShareWithComment from "./ShareWithReplyDialog";
import PostMidia from "./PostMidia";

function CompactPost({ user, data }) {
    const [postData, setPostData] = useState(data);
    const [isMeShare, setIsMeShare] = useState(data.postType == PostType.SHARE && data.author.id == user.id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const navigate = useNavigate();
    const isReply = data.postType == PostType.REPLY;
    const isShare = data.postType == PostType.SHARE;
    const hasShared = isShare ? postData.originalPost.replyPost.length : postData.replyPost.length;
    const hasMidia = postData.hasMidia;
    console.log("checking original", postData.originalPost)
    // const isMeShare = data.postType == PostType.SHARE && data.author.id == user.id;
    const usePostData = isShare ? postData.originalPost : postData;
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
        e.stopPropagation();
        if (hasShared) {
            console.log("unsharing")
            const result = await unsharePost(usePostData.id);
            if (result && result.success) {
                if (isShare) {
                    setPostData({ ...postData, originalPost: { ...postData.originalPost, replyPost: [] } });
                } else {
                    setPostData({ ...postData, replyPost: [] });
                }
                setIsMeShare(false);
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
            setIsMeShare(true);
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

    function handleCloseDialog() {
        setIsDialogOpen(false);
        setIsShareDialogOpen(false);
    };

    function handleShareReplyDialog(e) {
        e.stopPropagation();
        setIsShareDialogOpen(true);
    }

    function handleSeePost(e) {
        e.stopPropagation();
        navigate(`/${usePostData.author.username}/post/${usePostData.id}`);
    }

    function handleSeeAuthor(e) {
        e.stopPropagation();
        navigate(`/${usePostData.author.username}`);
    }

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleCloseDialog();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    console.log("postdata", usePostData)

    return (
        <>
            <div className="compact-post" onClick={handleSeePost}>
                <div className="compact-post-head" onClick={handleSeeAuthor}>
                    <UserPicture id={usePostData.author.id} size={20} useBorder={false} />
                    <span>{usePostData.author.name}</span>
                    <span>@{usePostData.author.username} • {formatedDate}</span>
                </div>
                <div className="compact-post-body">
                    <div className="post-content">
                        <textarea readOnly defaultValue={usePostData.content}></textarea>
                        {hasMidia && <PostMidia postId={postData.id} />}
                    </div>
                </div>
            </div >
            <ReplyDialog isOpen={isDialogOpen} originalPost={data} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />
            <ShareWithComment isOpen={isShareDialogOpen} originalPost={data} user={user} onCancel={handleCloseDialog} onConfirm={handleCloseDialog} />
        </>
    )
}






export default CompactPost;