import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, removeBookmarkPost } from "../../api/requests";
import { useState } from "react";
import { useNavigate } from "react-router";

function Post({ data }) {
    const [postData, setPostData] = useState(data);
    const navigate = useNavigate();

    const formatedDate = formatDate(postData.createdAt);

    async function handleLike() {
        e.stopPropagation();
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

    async function handleBookmark(e) {
        e.stopPropagation();
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

    function handleSeePost() {
        navigate(`${postData.author.username}/post/${postData.id}`);
    }

    return (
        <>
            <div className="post" onClick={handleSeePost}>
                <UserPicture id={postData.author.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false}/>
                <div className="post-data">
                    <div className="post-head">
                        <span>{postData.author.name}</span>
                        <span>@{postData.author.username} - {formatedDate}</span>
                    </div>
                    <div className="post-content">{postData.content}</div>
                    <div className="post-controls">
                        <div className="comment-control-button">
                            <div>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                                </svg>
                            </div>
                        </div>
                        <div className="share-control-button">
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
                </div>
            </div>
        </>
    )
}






export default Post;