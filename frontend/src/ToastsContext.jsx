import { createContext, useCallback, useRef, useState } from "react";

export const ToastContext = createContext({
    toasts: [],
    addToast: () => { },
});


function ToastContextProvider({ children }) {
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    const addToast = useCallback((message, duration = 5000) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        const id = Date.now();

        toastTimeoutRef.current = setTimeout(() => {
            setToast(current => {
                if (current?.id === id) {
                    return null;
                }

                return current;
            });

            toastTimeoutRef.current = null;
        }, duration);

        setToast({
            id,
            message,
        });
    }, []);

    return (
        <ToastContext value={{ addToast }}>
            {children}
            {toast && <div className="toast-parent">
                <div className="toast">
                    <p>{toast.message}</p>
                </div>
            </div>}
        </ToastContext>
    );
}

export default ToastContextProvider;