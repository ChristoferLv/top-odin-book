import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import { bookmarkPost, dislikePost, likePost, removeBookmarkPost } from "../../api/requests";
import { useState } from "react";
import { useNavigate } from "react-router";

function Comment({ data }) {
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

    return (
        <>
            <div className="replie-body">
                <UserPicture id={postData.author.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false}/>
                <div className="post-data">
                    <div className="post-head">
                        <span>{postData.author.name}</span>
                        <span>@{postData.author.username} - {formatedDate}</span>
                    </div>
                    <div className="post-content">{postData.content}</div>
                   
                </div>
            </div>
        </>
    )
}






export default Comment;