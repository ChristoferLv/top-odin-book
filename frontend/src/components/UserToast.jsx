import { useEffect, useRef, useState } from "react";
import { logOut } from "../../api/requests";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import UserPicture from "./UserPicture";

function UserToast({ user }) {
    const [isBalloonOpen, setIsBalloonOpen] = useState(false);
    const toastRef = useRef(null);

    function handleBalloon() {
        if (isBalloonOpen)
            setIsBalloonOpen(false);
        else {
            setIsBalloonOpen(true);
        }
    }


    return (
        <>
            {isBalloonOpen && <div className="transparent-overlay"></div>}
            <div onClick={handleBalloon} className="user-toast" ref={toastRef}>
                <UserPicture size={USER_PICTURE_DEFAULT_SIZE} username={user.username} user id={user.id} useBorder={false} />
                <div className="user-toast-info">
                    <p>
                        {user.name}
                    </p>
                    <p>
                        @{user.username}
                    </p>
                </div>
                <LogOutBalloon isOpen={isBalloonOpen} username={user.username} onClose={handleBalloon} toast={toastRef} />
            </div>
        </>
    )
}


function LogOutBalloon({ username, isOpen, onClose, toast }) {
    const dialogRef = useRef(null);
    const [position, setPosition] = useState(null);
    useEffect(() => {
        if (!isOpen) return;

        const rect = toast.current.getBoundingClientRect();

        const position = {
            top: "-80px",
            left: rect.x -200
        }

        setPosition(position);

        function handleClose(e) {
            e.stopPropagation();
            onClose();
        }

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


    function handleLogOut() {
        logOut();
    }

    if (!isOpen) return null;
    if (!position) return null;

    return (
        <>
            <div className="logout-balloon" ref={dialogRef}
                style={{ left: position.left, top: position.top }}
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