import { useContext, useEffect, useRef, useState } from "react";
import { ToastContext } from "../contexts/ToastsContext";
import { deletePost } from "../../api/requests";

function DeletePostBalloon({ isOpen, postId, onClose, onDelete, postRef }) {
    const balloonRef = useRef(null);
    const [position, setPosition] = useState(null);
    const { addToast } = useContext(ToastContext);

    function handleClose(e) {
        e.stopPropagation();
        onClose(e);
    }

    useEffect(() => {
        if (!isOpen) return;

        const rect = postRef.current.getBoundingClientRect();
        const position = {
            x: rect.x - 115,
            y: rect.y + window.scrollY
        }

        if ((window.innerHeight - rect.bottom) < 20) {
            position.y = position.y - (25 - (window.innerHeight - rect.bottom))
        }

        setPosition(position);

        function handleClickOutside(e) {
            if (balloonRef.current && !balloonRef.current.contains(event.target)) {
                handleClose(e);
            } else {
                e.stopPropagation();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleClose(event);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    async function handleDeletePost(e) {
        e.stopPropagation();
        try {
            const result = await deletePost(postId);
            if (result.ok) {
                const data = await result.json();
                if (data.success){
                    addToast("Your post was deleted");
                    onDelete();
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (!isOpen) return null;

    if (!position) return null;

    return (
        <>
            <div style={{ backgroundColor: "transparent" }} className="transparent-overlay"></div>
            <div className="delete-balloon" ref={balloonRef}
                style={{ left: position.x, top: position.y }}
            >
                <div className="delete-button" onClick={handleDeletePost}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                        <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path></g>
                    </svg>
                    <span>Delete Post</span>
                </div>
            </div>
        </>
    );
}


export default DeletePostBalloon;