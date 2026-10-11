import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { PostType } from "../utils/defaults"
import { useState } from "react";
import { useNavigate } from "react-router";
import PostMidia from "./PostMidia";
import hoverTimer from "../OnHoverTimer";
import UserCardInfos from "./UserCardInfos";

function CompactPost({ user, data }) {
    const [postData] = useState(data);
    const navigate = useNavigate();
    const isShare = data.postType == PostType.SHARE;
    const hasMidia = postData.hasMidia;
    const usePostData = isShare ? postData.originalPost : postData;
    const formatedDate = formatDate(postData.createdAt);
    const { isOpen, hoverRef, handleMouseEnter, handleMouseLeave } = hoverTimer();

    function handleSeePost(e) {
        e.stopPropagation();
        navigate(`/${usePostData.author.username}/post/${usePostData.id}`);
    }

    function handleSeeAuthor(e) {
        e.stopPropagation();
        navigate(`/${usePostData.author.username}`);
    }

    function goToPicturePage() {
        navigate(`/${usePostData.author.username}/post/${usePostData.id}/photo`);
    }

    return (
        <>
            <div className="compact-post" onClick={handleSeePost}>
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {isOpen && <UserCardInfos key={usePostData.author.username} username={usePostData.author.username} hoverRef={hoverRef} isMe={usePostData.author.id == user.id} />}
                </div>
                <div className="compact-post-head" onClick={handleSeeAuthor}>
                    <div className="picture-wrap" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <UserPicture id={usePostData.author.id} username={usePostData.author.username} size={20} useBorder={true} />
                    </div>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className="post-name">{usePostData.author.name}</span>
                    </div>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className="post-username">@{usePostData.author.username} • {formatedDate}</span>
                    </div>
                </div>
                <div className="compact-post-body">
                    <div className="post-content">
                        {usePostData.content?.length > 0 && <textarea readOnly defaultValue={usePostData.content}></textarea>}
                        {hasMidia && <PostMidia postId={postData.id} dimensions={postData.dimensions} seePhoto={goToPicturePage} />}
                    </div>
                </div>
            </div >
        </>
    )
}






export default CompactPost;