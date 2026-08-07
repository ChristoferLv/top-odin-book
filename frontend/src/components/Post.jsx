import { formatDate } from "../utils/dateUtils";

function Post({ data }) {

    const formatedDate = formatDate(data.createdAt);

    return (
        <>
            <div className="post">
                <div className="post-head">{data.author.username} @{data.author.username} - {formatedDate}</div>
                <div className="post-content">{data.content}</div>
            </div>
        </>
    )
}






export default Post;