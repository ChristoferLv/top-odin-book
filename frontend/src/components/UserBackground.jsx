import { useEffect, useState } from "react";
import background from "../../public/bkgd.png";
import { fetchUserBackground } from "../../api/requests";

function UserBackground({id}) {
    const [backgroundBuff, setBackground] = useState(null);
    const [mime, setMime] = useState(null);
    const rawBuffer = new Uint8Array(backgroundBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrlBkgd = URL.createObjectURL(blob);

    useEffect(() => {
        async function getBackground() {
            if (id) {
                const background = await fetchUserBackground(id);
                setBackground(background.data.buffer?.data);
                setMime(background.data.mime);
            }
        }
        getBackground();
    }, [id])

    useEffect(() => {
        return;
        return () => {
            if (imageUrlBkgd) URL.revokeObjectURL(imageUrlBkgd);
        }
    }, [])


    return (
        <>
            <div className="user-background">
                <img src={!backgroundBuff ? background :
                    imageUrlBkgd} alt="" />
            </div>
        </>
    )
}


export default UserBackground;