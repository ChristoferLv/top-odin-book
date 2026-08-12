import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../AuthContext";
import UserBackground from "./UserBackground";
import UserPicture from "./UserPicture";
import { editUser, fetchUserBackground, fetchUserPicture, sendUserBackground, sendUserPicture } from "../../api/requests";
import { useNavigate } from "react-router";
import background from "../../public/bkgd.png";

function EditProfile() {
    const { user, isLoading, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState({ name: "", bio: "" });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const fileBackgroundRef = useRef(null);
    const [pictureBuff, setPicture] = useState(null);
    const [mime, setMime] = useState(null);
    const [backgroundBuff, setBackground] = useState(null);
    const [mimeBkgd, setMimeBkgd] = useState(null);

    function handleChange(e) {
        const whoChanged = event.target;
        const newValues = { ...userData, [whoChanged.name]: whoChanged.value }
        setUserData(newValues);
    }

    async function handleSaveEdit() {
        const result = await editUser(userData);
        if (result && result.success) {
            localStorage.setItem('user', JSON.stringify(result.data));
            setUser(result.data);
            navigate("/" + user.username);
        }
    }

    function handleClickImage(e) {
        fileInputRef.current.click();
    }

    async function handleUploadImage(e) {
        e.target.parentElement.requestSubmit();
    }

    async function handlePictureSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        fileInputRef.current.value = "";
        if (data.picture.size > 5000000) {
            alert("Maximum picture file size is 5MB.");
            return;
        }

        const result = await sendUserPicture(data);
        if (result.success) {
            setPicture(result.data.data);
            // setUpdate(c => c + 1)
        }
    }

    function handleClickBackground(e) {
        fileBackgroundRef.current.click();
    }

    async function handleUploadBackground(e) {
        e.target.parentElement.requestSubmit();
    }

    async function handleBackgroundSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        fileBackgroundRef.current.value = "";
        if (data.background.size > 5000000) {
            alert("Maximum background file size is 5MB.");
            return;
        }

        const result = await sendUserBackground(data);
        if (result.success) {
            setBackground(result.data.data);
            // setUpdate(c => c + 1)
        }
    }

    useEffect(() => {
        async function getPicture() {
            if (user) {
                const picture = await fetchUserPicture(user.id);
                setPicture(picture.data.buffer?.data);
                setMime(picture.data.mime);
            }
        }
        getPicture();
    }, [user, isLoading])

    useEffect(() => {
        async function getBackground() {
            if (user) {
                const background = await fetchUserBackground(user.id);
                if (background.success) {
                    setBackground(background.data.buffer?.data);
                    setMimeBkgd(background.data.mime);
                }
            }
        }
        getBackground();
    }, [user, isLoading])

    useEffect(() => {
        if (user) {
            setUserData({ name: user.name, bio: user.bio });
        }
    }, [user, isLoading])

    const rawBufferPicture = new Uint8Array(pictureBuff);
    const blobPicture = new Blob([rawBufferPicture], { type: mime });
    const imageUrlPicture = URL.createObjectURL(blobPicture);

    const rawBufferBkgd = new Uint8Array(backgroundBuff);
    const blobBkgd = new Blob([rawBufferBkgd], { type: mimeBkgd });
    const imageUrlBkgd = URL.createObjectURL(blobBkgd);

    return (
        <>
            <div className="my-page my-page-edit">
                <form onSubmit={handlePictureSubmit}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        name="picture"
                        style={{ display: "none" }}
                        onChange={handleUploadImage}
                    />
                </form>
                <form onSubmit={handleBackgroundSubmit}>
                    <input
                        ref={fileBackgroundRef}
                        type="file"
                        accept="image/*"
                        name="background"
                        style={{ display: "none" }}
                        onChange={handleUploadBackground}
                    />
                </form>
                <div>
                    <div className="my-page-top edit-page-top">
                        <div onClick={() => navigate(-1)} className="my-page-back-button">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                            </svg>
                            <div className="tooltip">
                                Back
                            </div>
                        </div>
                        <p>Edit Profile</p>
                        <button onClick={handleSaveEdit} className="save-profile">Save</button>
                    </div>
                    <>
                        <div className="user-background" onClick={handleClickBackground}>
                            <img src={!backgroundBuff ? background :
                                imageUrlBkgd} alt="" />
                        </div>
                    </>
                    <div className="my-page-controls">
                        <div className="my-page-picture">
                            <div
                                className="profile-pic" onClick={handleClickImage}
                            >
                                <img src={!rawBufferPicture ? "../public/avatar.png" :
                                    imageUrlPicture} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="user-data-inputs">
                        <div className="user-field">
                            <input name="name" type="text" id="name" placeholder=" " required value={userData.name} onChange={handleChange} />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="user-field">
                            <textarea name="bio" type="text" id="bio" placeholder=" " required defaultValue={userData.bio} onChange={handleChange} />
                            <label htmlFor="bio">Bio</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditProfile;