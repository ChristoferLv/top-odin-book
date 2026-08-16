import { useEffect, useState } from "react";
import { fetchUserPicture } from "../../api/requests";
import dafaultAvatar from "../../public/avatar.png";


function UserPicture({ id, size, useBorder }) {
    const [pictureBuff, setPicture] = useState(null);
    const [mime, setMime] = useState(null);
    const rawBuffer = new Uint8Array(pictureBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);


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

    return (
        <>
            <div className="pic-container">
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