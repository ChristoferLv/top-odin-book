import { useEffect, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts } from "../../api/requests";

function ContentPane() {
    const [postsList, setPostsList] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const result = await fetchAllPosts();
            if (result && result.success) {
                setPostsList(result.data)
            }
        }

        getPosts();
    }, []);

    return (<>
        <div className="content-pane">
            <NewPost />
            <PostsList postsList={postsList} />
        </div>
    </>)
}



export default ContentPane;