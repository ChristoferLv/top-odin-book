import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { makePost } from "../../api/requests";
import UserPicture from "./UserPicture";

function NewPost() {
    const { user, isLoading } = useContext(AuthContext);

    const [postContent, setPostContent] = useState("");




    function handlePostContentChange(e) {
        setPostContent(e.target.value);
    }

    async function handlePost(e) {
        console.log("here", e.target)
        e.preventDefault();
        const payload = new URLSearchParams();
        payload.append("content", postContent)
        const check = Object.fromEntries(payload.entries());

        console.log(check);

        if (postContent.length < 1) {
            return;
        }

        const result = await makePost(payload);
        if (result) {

        }

        setPostContent("");
    }

    return (
        <>
            <div className="new-post">
                <UserPicture size={40}/>
                <form onSubmit={handlePost}>
                    <textarea name="content" placeholder="What is happening?" onChange={handlePostContentChange} value={postContent}></textarea>
                    <input type="submit" value="Post" />
                </form>
            </div>
        </>
    )
}

export default NewPost;