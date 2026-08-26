import { useContext, useRef, useState } from "react";
import { AuthContext } from "../AuthContext";
import { makePost } from "../../api/requests";
import UserPicture from "./UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"

function NewPost() {
    const { user, isLoading } = useContext(AuthContext);

    const [postContent, setPostContent] = useState("");

    const fileInputRef = useRef(null);

    function handleClickAttach(e) {
        fileInputRef.current.click();
    }

    // async function handleUploadImage(e) {
    //     e.target.parentElement.requestSubmit();
    // }

    function handlePostContentChange(e) {
        setPostContent(e.target.value);
    }

    async function handlePost(e) {
        e.preventDefault();
        console.log(fileInputRef.current, fileInputRef.current.files)
        const formData = new FormData();
        formData.append("picture", fileInputRef.current.files[0]);
        formData.append("content", postContent)
        // const check = Object.fromEntries(payload.entries());
        // return;
        if (postContent.length < 1 && fileInputRef.current.files[0].length == 0) {
            return;
        }

        const result = await makePost(formData);
        if (result) {
            console.log(result)
        }

        setPostContent("");
    }

    return (
        <>
            <div className="new-post">
                <UserPicture id={user.id} size={USER_PICTURE_DEFAULT_SIZE} />
                <form onSubmit={handlePost}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        name="midia"
                        style={{ display: "none" }}
                    // onChange={handleUploadImage}
                    />
                    <textarea name="content" placeholder="What is happening?" onChange={handlePostContentChange} value={postContent}></textarea>
                    <div className="new-post-controls">
                        <div onClick={handleClickAttach} className="midia-btn">
                            <svg viewBox="0 0 24 24"><g><path d="M15 7c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"></path><path clip-rule="evenodd" d="M14.1 2.5c1.103 0 1.991-.001 2.709.058.728.06 1.368.185 1.96.487.941.48 1.707 1.245 2.186 2.185.302.593.428 1.233.487 1.961.059.718.058 1.606.058 2.71V14.1c0 1.103.001 1.991-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.487-.718.059-1.606.058-2.71.058H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058H14.1zM4.506 15.442c.006.473.017.865.045 1.203.05.606.142.954.276 1.217.288.565.746 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c.36 0 .685-.003.981-.005L7.96 12.373l-3.453 3.07zM9.9 4.5c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.565.288-1.023.746-1.31 1.31-.135.264-.228.612-.277 1.217C4.5 7.971 4.5 8.764 4.5 9.9v2.873l3.54-3.147 9.63 9.63c.07-.026.133-.053.192-.083.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.218.05-.616.051-1.409.051-2.545V9.9c0-1.136 0-1.929-.05-2.546-.05-.605-.143-.953-.277-1.216-.288-.565-.746-1.023-1.31-1.31-.264-.135-.612-.228-1.218-.277C16.03 4.5 15.236 4.5 14.1 4.5H9.9z" fill-rule="evenodd"></path></g></svg>
                        </div>
                        <input type="submit" value="Post" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default NewPost;