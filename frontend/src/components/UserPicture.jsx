import { useEffect, useState } from "react";
import { fetchUserPicture } from "../../api/requests";
import dafaultAvatar from "../../public/avatar.png";
import { useNavigate } from "react-router";


function UserPicture({ id, username, size, useBorder }) {
    const [pictureBuff, setPicture] = useState(null);
    const [mime, setMime] = useState(null);
    const rawBuffer = new Uint8Array(pictureBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPicture() {
            if (id) {
                const picture = await fetchUserPicture(id);
                if (picture.data.buffer) {
                    setPicture(picture.data.buffer?.data);
                    setMime(picture.data.mime);
                }
            }
        }
        getPicture();
    }, [id])

    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        }
    }, [])

    function handleSeeUser(e) {
        e.stopPropagation();
        if (username)
            navigate("/" + username);
    }

    return (
        <>
            <div className="pic-container" onClick={handleSeeUser}>
                <div className={`profile-pic ${useBorder ? "pic-border" : ""}`}
                    style={{ width: size + "px", height: size + "px" }}>
                    <img src={!pictureBuff ? dafaultAvatar :
                        imageUrl} alt="" />
                </div>
            </div>
        </>
    );
}

export default UserPicture;