import { useContext, useEffect, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts } from "../../api/requests";
import { AuthContext } from "../AuthContext";

function ContentPane() {
        const { user, setUser } = useContext(AuthContext);
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
            <PostsList postsList={postsList} user={user} onUserPage={false}/>
        </div>
    </>)
}



export default ContentPane;