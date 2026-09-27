import { formatDate } from "../utils/dateUtils";
import UserPicture from "../components/UserPicture"
import { PostType } from "../utils/defaults"
import { useState } from "react";
import { useNavigate } from "react-router";
import PostMidia from "./PostMidia";

function CompactPost({ user, data }) {
    const [postData] = useState(data);
    const navigate = useNavigate();
    const isShare = data.postType == PostType.SHARE;
    const hasMidia = postData.hasMidia;
    const usePostData = isShare ? postData.originalPost : postData;
    const formatedDate = formatDate(postData.createdAt);

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
                <div className="compact-post-head" onClick={handleSeeAuthor}>
                    <UserPicture id={usePostData.author.id} username={usePostData.author.username} size={20} useBorder={true} />
                    <span>{usePostData.author.name}</span>
                    <span>@{usePostData.author.username} • {formatedDate}</span>
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