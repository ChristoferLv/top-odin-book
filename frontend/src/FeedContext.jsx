import { createContext, useCallback, useState } from "react";

export const FeedContext = createContext({
    feed: [],
    feedSetter: () => { },
    pageOnContext: 0,
    feedSetter: () => { },
    allowLoad: false,
    setAllowLoad: () => { },
});


function FeedContextProvider({ children }) {
    const [feed, setFeed] = useState([]);
    const [pageOnContext, setPageOnContext] = useState(0);
    const [allowLoad, setAllowLoad] = useState(false);
    const [resetFeed, setResetFeed] = useState(false);

    const feedSetter = useCallback((value) => {
        setFeed(value);
    }, []);

    const pageSetter = useCallback((value) => {
        setPageOnContext(value);
    }, []);

    const allowLoadSetter = useCallback(() => {
        setAllowLoad(true);
    }, [])

    const resetFeedSetter = useCallback((value) => {
        setResetFeed(value);
    }, [])

    return (
        <FeedContext value={{ feed, feedSetter, pageOnContext, pageSetter, resetFeed, resetFeedSetter }} >
            {children}
        </FeedContext>
    );
}

export default FeedContextProvider;