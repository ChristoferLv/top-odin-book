import { useEffect, useState } from "react";
import { fetchPostMidia } from "../../api/requests";
import PictureDialog from "./PictureDialog";

function PostMidia({ postId, seePhoto, dimensions }) {
    const [midiaBuff, setMidia] = useState(null);
    const [mime, setMime] = useState(null);
    const [modal, setModal] = useState(false);

    function handleSeePicture(e) {
        e.stopPropagation();
        seePhoto();
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

    const [width, height] = dimensions.split("x");

    const MAX_HEIGHT = 600;

    const ratio = Number(width) / Number(height);

    const displayedHeight = Math.min(
        Number(height),
        MAX_HEIGHT
    );

    return (
        <>
            <div
                className="midia"
                onClick={handleSeePicture}
                style={{
                    aspectRatio: `${width} / ${height}`,
                    maxHeight: "600px",
                }}
            >
                {midiaBuff ? (
                    <img
                        src={imageUrl}
                        loading="lazy"
                    />
                ) : (
                    <div />
                )}
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