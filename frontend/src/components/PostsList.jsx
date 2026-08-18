import Post from "./Post";

function PostsList({user, postsList}) {
    return (<>
        <div className="posts-list">
            {postsList.map((post) => {
                return <Post key={post.id} data={post} user={user}/>
            })}
        </div>
    </>)
}



export default PostsList;