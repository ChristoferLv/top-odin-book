import { formatDate } from "../utils/dateUtils";
import UserPicture from "./UserPicture"
import { PostType, USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, makePost, removeBookmarkPost, sharePost, unsharePost } from "../../api/requests";
import { useState } from "react";
import { useNavigate } from "react-router";

function ShareWithComment({ isOpen, user, originalPost, onCancel, onConfirm }) {
    const [replyContent, setReplyContent] = useState("");
    const [isActive, setIsActive] = useState(false);

    function handleReplyContentChange(e) {
        if (e.target.value.length > 0)
            setIsActive(true);
        else
            setIsActive(false);
        
        setReplyContent(e.target.value);
    }

    async function handlePost(e) {
        e.preventDefault();
        const payload = new URLSearchParams();
        payload.append("content", replyContent);
        payload.append("originalPostId", originalPost.id);
        const check = Object.fromEntries(payload.entries());
        console.log(replyContent)
        if (replyContent.length < 1) {
            return;
        }

        const result = await makePost(payload);
        if (result && result.success) {
            onConfirm();
        }

        setReplyContent("");
    }


    if (!isOpen) return null;
    const formatedDate = formatDate(originalPost.createdAt);

    return (
        <>
            <div className="overlay">
                <div className='replie-dialog' role="alertdialog" aria-modal="true">
                    <div className="dialog-header">
                        <button className='close-dialog' onClick={onCancel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                    <div className="reply">
                        <div className="new-reply">
                            <UserPicture id={user.id} size={USER_PICTURE_DEFAULT_SIZE} />
                            <form>
                                <textarea name="content" placeholder="Post your reply" onChange={handleReplyContentChange} value={replyContent}></textarea>
                            </form>
                        </div>
                    </div>
                    <div className="post-body">
                        <UserPicture id={originalPost.author.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                        <div className="post-data">
                            <div className="post-head">
                                <span>{originalPost.author.name}</span>
                                <span>@{originalPost.author.username} · {formatedDate}</span>
                            </div>
                            <div className="post-content">
                                <textarea readOnly defaultValue={originalPost.content}></textarea>
                            </div>
                            <div className="repliying-to">
                                <span>Replying to&nbsp;</span>
                                <span>@{originalPost.author.username}</span>
                            </div>
                        </div>
                    </div>
                    <div className='dialog-actions'>
                        <button onClick={handlePost} className='dialog-confirm' disabled={!isActive}>
                            Replie
                        </button>
                    </div>
                </div>
            </div>
        </>);
}




export default ShareWithComment;