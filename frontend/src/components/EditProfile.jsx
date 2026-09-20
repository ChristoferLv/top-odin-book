import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../AuthContext";
import { editUser, fetchUserBackground, removeBackground, removePicture, sendUserBackground, sendUserPicture } from "../../api/requests";
import { useNavigate } from "react-router";
import background from "../../public/bkgd.png";
import { PictureContext } from "../PictureContext";
import dafaultAvatar from "../../public/avatar.png";
import { ToastContext } from "../ToastsContext";

function EditProfile() {
    const { userPictureUrl, isPictureSet, pictureSetter } = useContext(PictureContext);
    const { addToast } = useContext(ToastContext);
    const { user, isLoading, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState({ name: "", bio: "" });
    const [userDataValid, setUserDataValid] = useState({ name: true, bio: true });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const fileBackgroundRef = useRef(null);
    const [backgroundBuff, setBackground] = useState(null);
    const [mimeBkgd, setMimeBkgd] = useState(null);

    function handleChange(e) {
        const whoChanged = e.target;
        let value = whoChanged.value;
        let valid = true;
        if (whoChanged.name == "name") {
            if (!value?.length) {
                valid = false;
            }

            if (value?.length > 50) {
                value = value.slice(0, 50);
            }
        }
        if (whoChanged.name == "bio") {
            // if (!value?.length || value.length == 0) {
            //     valid = false;
            // }

            if (value?.length > 160) {
                value = value.slice(0, 160);
            }
        }

        setUserDataValid({ ...userDataValid, [whoChanged.name]: valid });
        const newValues = { ...userData, [whoChanged.name]: value }
        setUserData(newValues);
    }

    async function removeImg(e) {
        e.stopPropagation();
        const result = await removePicture();
        if (result.success) {
            setPicture(null);
        }
    }

    async function removeBckg(e) {
        e.stopPropagation();
        const result = await removeBackground();
        if (result.success) {
            setBackground(null);
        }
    }

    async function handleSaveEdit() {
        if (userData.name.length < 1) return;
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
        const formData = new FormData();
        formData.append("picture", fileInputRef.current.files[0]);
        fileInputRef.current.value = "";
        if (formData.get("picture").size > 5000000) {
            addToast("Your file is to large. The maximum file size is 5MB");
            return;
        }

        const result = await sendUserPicture(formData);
        if (result.success) {
            const rawBufferPicture = new Uint8Array(result.data.buffer?.data);
            const blobPicture = new Blob([rawBufferPicture], { type: result.data.mime });
            const imageUrlPicture = URL.createObjectURL(blobPicture);
            pictureSetter(imageUrlPicture);
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
        const formData = new FormData();
        formData.append("background", fileBackgroundRef.current.files[0]);
        fileBackgroundRef.current.value = "";
        if (formData.get("background").size > 5000000) {
            addToast("Your file is to large. The maximum file size is 5MB");
            return;
        }

        const result = await sendUserBackground(formData);
        if (result.success) {
            setBackground(result.data.data);
        }
    }

    // useEffect(() => {
    //     async function getPicture() {
    //         if (user) {
    //             const picture = await fetchUserPicture(user.id);
    //             setPicture(picture.data.buffer?.data);
    //             setMime(picture.data.mime);
    //         }
    //     }
    //     getPicture();
    // }, [user, isLoading])

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
                        <div className="user-background">
                            <img src={!backgroundBuff ? background :
                                imageUrlBkgd} alt="" />
                            <div className="background-actions">
                                <button title="Change Background" className="change-background" onClick={handleClickBackground}>
                                    <svg viewBox="0 0 20 20" aria-hidden="true"><g>
                                        <path d="M17.084 7.5c0-1.163 0-1.744-.144-2.218-.323-1.065-1.157-1.899-2.222-2.222-.473-.143-1.055-.143-2.218-.143H8.25c-1.867 0-2.8 0-3.513.363-.627.32-1.137.83-1.457 1.457-.363.713-.363 1.646-.363 3.513v4.25c0 1.163 0 1.745.144 2.218.323 1.065 1.156 1.899 2.222 2.222.473.143 1.054.143 2.217.143" fill="none" stroke="currentColor" stroke-width="1.667"></path>
                                        <path d="M2.917 12.5l3.75-3.333 2.917 2.916" fill="none" stroke="currentColor" stroke-width="1.667"></path>
                                        <circle cx="12.5" cy="7.5" fill="currentColor" r="1.667"></circle>
                                        <path d="M17.56 10.894c-.644-.645-1.684-.659-2.346-.032l-3.656 3.463c-.6.568-.968 1.34-1.031 2.164l-.11 1.428 1.479-.114c.793-.061 1.539-.404 2.101-.967l3.564-3.563c.657-.657.657-1.722 0-2.38z" fill="none" stroke="currentColor" stroke-width="1.667"></path></g>
                                    </svg>
                                </button>
                                {backgroundBuff && <button title="Remove background" className="remove-background" onClick={removeBckg}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                                    </svg>
                                </button>}
                            </div>
                        </div>
                    </>
                    <div className="my-page-controls">
                        <div className="my-page-picture">
                            <div
                                className="profile-pic pic-border"
                            >
                                {isPictureSet && <img src={userPictureUrl == "" ? dafaultAvatar :
                                    userPictureUrl} alt="" />}

                                <button title="Change picture" className="change-user-picture" onClick={handleClickImage}>
                                    <svg viewBox="0 0 20 20" aria-hidden="true"><g>
                                        <path d="M17.084 7.5c0-1.163 0-1.744-.144-2.218-.323-1.065-1.157-1.899-2.222-2.222-.473-.143-1.055-.143-2.218-.143H8.25c-1.867 0-2.8 0-3.513.363-.627.32-1.137.83-1.457 1.457-.363.713-.363 1.646-.363 3.513v4.25c0 1.163 0 1.745.144 2.218.323 1.065 1.156 1.899 2.222 2.222.473.143 1.054.143 2.217.143" fill="none" stroke="currentColor" stroke-width="1.667"></path>
                                        <path d="M2.917 12.5l3.75-3.333 2.917 2.916" fill="none" stroke="currentColor" stroke-width="1.667"></path>
                                        <circle cx="12.5" cy="7.5" fill="currentColor" r="1.667"></circle>
                                        <path d="M17.56 10.894c-.644-.645-1.684-.659-2.346-.032l-3.656 3.463c-.6.568-.968 1.34-1.031 2.164l-.11 1.428 1.479-.114c.793-.061 1.539-.404 2.101-.967l3.564-3.563c.657-.657.657-1.722 0-2.38z" fill="none" stroke="currentColor" stroke-width="1.667"></path></g>
                                    </svg>
                                </button>

                                {userPictureUrl != "" && <button title="Remove image" type="button" className='close-button' onClick={removeImg}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="white" />
                                    </svg>
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className="user-data-inputs">
                        <div className={`user-field ${userDataValid.name ? "" : "invalid"}`}>
                            <input name="name" type="text" id="name" placeholder=" " required value={userData.name} onChange={handleChange} />
                            <div className="field-infos">
                                <label htmlFor="name">Name</label>
                                <div className="counter">
                                    <span>{userData.name.length}/50</span>
                                </div>
                            </div>
                        </div>
                        <div className={`user-field ${userDataValid.bio ? "" : "invalid"}`}>
                            <div className="textarea-wrap">
                                <textarea name="bio" type="text" id="bio" placeholder=" " value={userData.bio} onChange={handleChange} />
                            </div>
                            <div className="field-infos">
                                <label htmlFor="name">Bio</label>
                                <div className="counter">
                                    <span>{userData.bio.length}/160</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditProfile;