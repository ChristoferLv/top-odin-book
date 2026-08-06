import Post from "./Post";

function PostsList({postsList}) {
    return (<>
        <div className="posts-list">
            {postsList.map((post) => {
                return <Post key={post.id} data={post} />
            })}
        </div>
    </>)
}



export default PostsList;