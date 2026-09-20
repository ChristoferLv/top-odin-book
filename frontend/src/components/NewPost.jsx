import { useContext, useEffect, useRef, useState, } from "react";
import { makePost } from "../../api/requests";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults"
import PictureDialog from "./PictureDialog";
import Pie from "./ProgressCircle";
import { useNavigate } from "react-router";
import { PictureContext } from "../PictureContext";
import dafaultAvatar from "../../public/avatar.png";
import { ToastContext } from "../ToastsContext";


function NewPost({ user, updatePosts }) {
    const { userPictureUrl, isPictureSet } = useContext(PictureContext);
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const [postContent, setPostContent] = useState("");
    const [modal, setModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [canPost, setCanPost] = useState(false);
    const fileInputRef = useRef(null);


    function handleClickAttach(e) {
        fileInputRef.current.click();
    }

    async function handleUploadImage(e) {
        // e.target.parentElement.requestSubmit();
        const file = e.target.files[0];
        if (file.size > 5000000) {
            addToast("Your file is to large. The maximum file size is 5MB");
            fileInputRef.current.value = "";
            return;
        }

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
            setCanPost(true);
        }

    }

    function handlePostContentChange(e) {
        let newCanPost = false;
        let value = e.target.value;
        if (value?.length > 280) {
            value = value.slice(0, 280);
        }
        if (value?.length != 0 && fileInputRef.current.files[0]?.size != 0) {
            newCanPost = true;
        }
        setCanPost(newCanPost);
        setPostContent(value);
    }

    function handleSeePicture(e) {
        e.stopPropagation();
        setModal(true);
    }

    function handleRemovePicture(e) {
        e.stopPropagation();
        setModal(false);
        setImageUrl("");
        if (postContent.length == 0) setCanPost(false);
        fileInputRef.current.value = "";
    }

    function handleCloseModal(e) {
        e.stopPropagation();
        setModal(false);
    }

    async function handlePost(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("picture", fileInputRef.current.files[0]);
        formData.append("content", postContent)
        // const check = Object.fromEntries(payload.entries());
        // return;
        if (postContent.length < 1 && fileInputRef.current.files[0].length == 0) {
            return;
        }

        const result = await makePost(formData);
        if (result && result.success) {
            addToast("Your post was sent.");
            fileInputRef.current.value = "";
            setImageUrl("");
            setModal(false);
            setPostContent("");
            setCanPost(false);
            updatePosts(result.data, true);
        }
    }


    function handleSeeUser(e) {
        e.stopPropagation();
        navigate("/" + user.username);
    }

    return (
        <>
            <div className="new-post">
                <div className="pic-container" onClick={handleSeeUser}>
                    <div className={`profile-pic`}
                        style={{ width: USER_PICTURE_DEFAULT_SIZE + "px", height: USER_PICTURE_DEFAULT_SIZE + "px" }}>
                        {<img src={userPictureUrl == "" ? dafaultAvatar :
                            userPictureUrl} alt="" />}
                    </div>
                </div>
                <form onSubmit={handlePost}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        name="midia"
                        style={{ display: "none" }}
                        onChange={handleUploadImage}
                    />
                    <textarea name="content" placeholder="What is happening?" onChange={handlePostContentChange} value={postContent}></textarea>

                    {imageUrl != "" && <div className="midia" onClick={handleSeePicture}>
                        <div className="remove-picture" onClick={handleRemovePicture}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-3 -2 19 19" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="white" />
                            </svg>
                        </div>
                        <img src={imageUrl} alt="" />
                    </div>}
                    <div className="controls-separator"></div>

                    <div className="new-post-controls">
                        <div onClick={handleClickAttach} className="midia-btn">
                            <svg viewBox="0 0 24 24"><g><path d="M15 7c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"></path><path clipRule="evenodd" d="M14.1 2.5c1.103 0 1.991-.001 2.709.058.728.06 1.368.185 1.96.487.941.48 1.707 1.245 2.186 2.185.302.593.428 1.233.487 1.961.059.718.058 1.606.058 2.71V14.1c0 1.103.001 1.991-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.487-.718.059-1.606.058-2.71.058H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058H14.1zM4.506 15.442c.006.473.017.865.045 1.203.05.606.142.954.276 1.217.288.565.746 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c.36 0 .685-.003.981-.005L7.96 12.373l-3.453 3.07zM9.9 4.5c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.565.288-1.023.746-1.31 1.31-.135.264-.228.612-.277 1.217C4.5 7.971 4.5 8.764 4.5 9.9v2.873l3.54-3.147 9.63 9.63c.07-.026.133-.053.192-.083.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.218.05-.616.051-1.409.051-2.545V9.9c0-1.136 0-1.929-.05-2.546-.05-.605-.143-.953-.277-1.216-.288-.565-.746-1.023-1.31-1.31-.264-.135-.612-.228-1.218-.277C16.03 4.5 15.236 4.5 14.1 4.5H9.9z" fillRule="evenodd"></path></g></svg>
                        </div>
                        {postContent.length > 0 && <Pie current={postContent.length} max={280} />}
                        {postContent.length > 0 && <div className="vertical-separator"></div>}
                        <input type="submit" value="Post" disabled={!canPost} />
                    </div>
                </form>
            </div>
            <PictureDialog
                openModal={modal}
                closeModal={handleCloseModal}
            >
                <div className="modal-image">
                    {imageUrl != "" && <img src={imageUrl} alt="" />}
                </div>
            </PictureDialog >
        </>
    )
}

export default NewPost;



