import { createContext, useCallback, useState } from "react";

export const NotificationsContext = createContext({
    notificationCount: 0,
    notificationSetter: () => { },
});


function NotificationsContextProvider({ children }) {
    const [notificationCount, setnotificationCount] = useState(0);

    const notificationSetter = useCallback((value) => {
        setnotificationCount(value);
    }, [])

    return (
        <NotificationsContext value={{ notificationCount, notificationSetter }} >
            {children}
        </NotificationsContext>
    );
}

export default NotificationsContextProvider;