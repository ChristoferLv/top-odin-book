import { useEffect, useState } from "react";
import { fetchPicture, getGroupPicture } from "../api/requests";

function UserPicture({ id, type, update, isOnline }) {
    const [pictureBuff, setPicture] = useState(null);
    const [mime, setMime] = useState(null);
    const rawBuffer = new Uint8Array(pictureBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);

    useEffect(() => {
        async function getPicture() {
            if (type == "GROUP") {
                const picture = await getGroupPicture(id);
                setPicture(picture.data.buffer?.data);
                setMime(picture.data.mime);
            } else if (id) {
                const picture = await fetchPicture(id);
                setPicture(picture.data.buffer?.data);
                setMime(picture.data.mime);
            }
        }
        getPicture();
    }, [update, id])

    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        }
    }, [])

    return (
        <>
            <div className="pic-container">
                {isOnline && <div className="status-dot"></div>}
                <div className="profile-pic">
                    <img src={!pictureBuff ? "../public/avatar.png" :
                        imageUrl} alt="" />
                </div>
            </div>
        </>
    );
}

export default UserPicture;