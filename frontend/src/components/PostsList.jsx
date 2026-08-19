import { PostType } from "../utils/defaults";
import Post from "./Post";
import PostWithComment from "./PostWithComment";

function PostsList({ user, postsList, onUserPage }) {
    return (<>
        <div className="posts-list">
            {postsList.map((post) => {
                if (!onUserPage && post.postType == PostType.REPLY)
                    return <PostWithComment key={post.id} data={post} user={user} />
                return <Post key={post.id} data={post} user={user} />
            })}
        </div>
    </>)
}



export default PostsList;