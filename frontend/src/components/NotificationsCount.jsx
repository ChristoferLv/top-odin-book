import { useCallback, useContext, useEffect, useState } from "react"
import { fetchNotificationsCount } from "../../api/requests";
import socketIO from "../../socket";
import { AuthContext } from "../AuthContext";
import { MainContext } from "./MainContext";



function NotificationsCount() {
    const { user, isLoading } = useContext(AuthContext);
    const { notificationCount, notificationSetter } = useContext(MainContext);
    const [socket, setSocket] = useState(null);

    const getNotificationsCount = useCallback(async () => {
        const result = await fetchNotificationsCount();
        if (result && result.success) {
            if (result.data != 0)
                notificationSetter(result.data);
        }
    })

    useEffect(() => {
        getNotificationsCount();
    }, []);



    useEffect(() => {
        function reloadNotifications() {
            getNotificationsCount();
        }

        if (socket) {
            socket.on('notification', reloadNotifications);
        }
        return () => {
            if (socket) {
                socket.off('notification', reloadNotifications);
            }
        };
    }, [socket]);

    useEffect(() => {
        if (user && !isLoading) {
            const storagedToken = localStorage.getItem('token');
            socketIO.auth = { token: storagedToken }
            const connection = socketIO.connect();
            setSocket(connection);
        }
    }, [user, isLoading]);


    if (!user) return null;
    if (notificationCount == 0) return null;

    return (<>
        <div className="notifications-count">
            <p>{notificationCount}</p>
        </div>
    </>
    );
}

export default NotificationsCount;