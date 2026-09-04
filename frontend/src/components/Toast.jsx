import { useEffect } from "react";

function Toast({ message, isOpen, setIsOpen }) {

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen])

    return (
        <>
            <div className="toast-parent">

                <div className="toast">
                    <p>{message}</p>
                </div>
            </div>
        </>
    );
}


export default Toast;