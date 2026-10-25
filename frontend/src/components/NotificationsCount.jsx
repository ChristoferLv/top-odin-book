import { useCallback, useContext, useEffect, useState } from "react"
import { fetchNotificationsCount } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { NotificationsContext } from "../NotificationsContext";



function NotificationsCount() {
    const { user } = useContext(AuthContext);
    const { notificationCount, notificationSetter, registerListener, removeListener, socket } = useContext(NotificationsContext);

    const getNotificationsCount = useCallback(async () => {
        const result = await fetchNotificationsCount();
        if (result && result.success) {
            if (result.data != 0)
                notificationSetter(result.data);
        }
    }, [])

    useEffect(() => {
        if (user)
            getNotificationsCount();
    }, [user]);

    useEffect(() => {
        function reloadNotificationsCount() {
            if (user)
                getNotificationsCount();
        }

        if (socket?.connected){
            registerListener("notification", reloadNotificationsCount);
        }

        return () => { removeListener("notification", reloadNotificationsCount) }
    }, [socket?.connected, user?.id]);

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