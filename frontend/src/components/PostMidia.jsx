import { useEffect, useRef, useState } from "react";
import { fetchPostMidia } from "../../api/requests";
import PictureDialog from "./PictureDialog";

function PostMidia({ postId, seePhoto }) {
    const [midiaBuff, setMidia] = useState(null);
    const [mime, setMime] = useState(null);
    const [modal, setModal] = useState(false);

    function handleSeePicture(e) {
        e.stopPropagation();
        seePhoto();
        // setModal(true);
    }

    function handleCloseModal(e) {
        e.stopPropagation();
        setModal(false);
    }

    useEffect(() => {
        async function getMidia() {
            const midia = await fetchPostMidia(postId);
            setMidia(midia.data.content?.data);
            setMime(midia.data.mime);
        }
        getMidia();
    }, []);

    const rawBuffer = new Uint8Array(midiaBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);

    if (!midiaBuff) return null;

    return (
        <>
            <div className="midia" onClick={handleSeePicture}>
                <img src={imageUrl} alt="" />
            </div>

            <PictureDialog
                openModal={modal}
                closeModal={handleCloseModal}
            >
                <div className="modal-image">
                    <img src={imageUrl} alt="" />
                </div>
            </PictureDialog >
        </>
    );
}

export default PostMidia;