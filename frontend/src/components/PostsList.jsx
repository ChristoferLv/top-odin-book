import { useRef } from "react";
import { PostType } from "../utils/defaults";
import Post from "./Post";
import PostShareWithReply from "./PostShareWithReply";
import PostWithComment from "./PostWithComment";
import LoadingSpinner from "./LoadingSpinner";

function PostsList({ observerRef, loading, hasMore, user, postsList, onUserPage }) {
    return (<>
        <div className="posts-list">
            {postsList.map((post) => {
                if (!onUserPage && post.postType == PostType.SHARE_REPLY)
                    return <PostShareWithReply key={post.id} data={post} user={user} />
                if (!onUserPage && post.postType == PostType.REPLY)
                    return <PostWithComment key={post.id} data={post} user={user} />
                return <Post key={post.id} data={post} user={user} />
            })}
        </div>
        {loading && <LoadingSpinner />}
        <div ref={observerRef} style={{ height: "20px", width: "100%", backgroundColor: "red" }}>
            {/* {!hasMore && <p>No more items to load.</p>} */}
        </div>
    </>)
}



export default PostsList;