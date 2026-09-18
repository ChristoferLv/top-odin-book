import { useContext, useEffect, useRef, useState } from "react";
import { logOut } from "../../api/requests";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import { useNavigate } from "react-router";
import dafaultAvatar from "../../public/avatar.png";
import { PictureContext } from "../PictureContext";


function UserToast({ user }) {
    const { userPictureUrl, isPictureSet } = useContext(PictureContext);
    const [isBalloonOpen, setIsBalloonOpen] = useState(false);
    const toastRef = useRef(null);
    const navigate = useNavigate();

    function handleBalloon() {
        if (isBalloonOpen)
            setIsBalloonOpen(false);
        else {
            setIsBalloonOpen(true);
        }
    }

    function handleSeeUser(e) {
        e.stopPropagation();
        navigate("/" + username);
    }

    return (
        <>
            {isBalloonOpen && <div style={{ backgroundColor: "transparent" }} className="transparent-overlay"></div>}
            {isBalloonOpen && <LogOutBalloon isOpen={isBalloonOpen} username={user.username} onClose={handleBalloon} toast={toastRef} />}
            <div onClick={handleBalloon} className="user-toast" ref={toastRef}>
                <div className="pic-container" onClick={handleSeeUser}>
                    <div className={`profile-pic`}
                        style={{ width: 40 + "px", height: 40 + "px" }}>
                        {<img src={userPictureUrl == "" ? dafaultAvatar :
                            userPictureUrl} alt="" />}
                    </div>
                </div>
                <div className="user-toast-body">
                    <div className="user-toast-info">
                        <p>
                            {user.name}
                        </p>
                        <p>
                            @{user.username}
                        </p>
                    </div>
                    <div className="more-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
}


function LogOutBalloon({ username, isOpen, onClose, toast }) {
    const dialogRef = useRef(null);
    const [position, setPosition] = useState(null);

    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }

    useEffect(() => {
        if (!isOpen) return;

        const rect = toast.current.getBoundingClientRect();
        const position = {
            x: rect.x,
            y: rect.y - 80
        }

        setPosition(position);

        function handleClickOutside(e) {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                handleClose(e);
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
                console.log("close close")
                handleClose(event);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    function handleLogOut() {
        logOut();
    }

    if (!isOpen) return null;
    if (!position) return null;

    return (
        <>
            <div className="logout-balloon" ref={dialogRef}
                style={{ left: position.x, top: position.y }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1"><g>
                    <path d="M22 17H2L12 6l10 11z"></path></g>
                </svg>
                <div className="logout-body" onClick={handleLogOut}>
                    <a>
                        <span>Log out from @{username}</span>
                    </a>
                </div>
            </div>
        </>
    );
}


export default UserToast;