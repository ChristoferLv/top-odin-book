import { createContext, useCallback, useState } from "react";

export const MainContext = createContext({
    notificationCount: 0,
    notificationSetter: () => { },
});


function MainContextProvider({ children }) {
    const [notificationCount, setnotificationCount] = useState(0);

    const notificationSetter = useCallback((value) => {
        setnotificationCount(value);
    }, [])

    return (
        <MainContext value={{ notificationCount, notificationSetter }} >
            {children}
        </MainContext>
    );
}

export default MainContextProvider;