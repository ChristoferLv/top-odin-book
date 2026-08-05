function Post({ data }) {



    return (
        <>
            <div className="post">
                <div className="post-head">{data.author.username} - {new Date(data.createdAt).toLocaleString()}</div>
                <div className="post-content">{data.content}</div>
            </div>
        </>
    )
}






export default Post;