import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import socketIO from "../../socket";

export const NotificationsContext = createContext({
    notificationCount: 0,
    notificationSetter: () => { },
    socket: {},
    registerListener: () => { },
    removeListener: () => { }
});


function NotificationsContextProvider({ children }) {
    const { user, isLoading } = useContext(AuthContext);
    const [notificationCount, setnotificationCount] = useState(0);
    const [socket, setSocket] = useState(null);

    const notificationSetter = useCallback((value) => {
        setnotificationCount(value);
    }, []);

    const registerListener = useCallback((eventName, functionCB) => {
        if (socket) {
            socket.on(eventName, functionCB);
        }
    }, [socket]);

    const removeListener = useCallback((eventName, functionCB) => {
        if (socket) {
            socket.off(eventName, functionCB);
        }
    }, [socket]);

    useEffect(() => {
        if (user && !isLoading) {
            const storagedToken = localStorage.getItem('token');
            if (!storagedToken) return;
            socketIO.auth = { token: storagedToken }
            const connection = socketIO.connect();
            setSocket(connection);
        }

        return () => {
            socketIO.disconnect();
            setSocket(null);
        };
    }, [user?.id, isLoading]);

    return (
        <NotificationsContext value={{ notificationCount, notificationSetter, registerListener, removeListener, socket }}>
            {children}
        </NotificationsContext>
    );
}

export default NotificationsContextProvider;