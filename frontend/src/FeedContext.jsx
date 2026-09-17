import { createContext, useCallback, useState } from "react";
import { fetchAllPosts } from "../api/requests";

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
    }, []);

    const deletePost = useCallback(async (postId, deleteOriginal) => {
        try {
            const newFeed = await fetchAllPosts(pageOnContext, null, true);
            if (newFeed && newFeed.success) {
                setFeed(newFeed.data);
            }else{
                setFeed([]);
                setPageOnContext(1);
            }
        }catch(e){
            console.log(e);
        }        
    }, []);

    const deleteSharedPost = useCallback((postId) => {
        const newFeed = feed.map((post) => {
            if (post.sharedPost && post.sharedPost.id == postId) {
                return { ...post, sharedPost: { ...post.sharedPost, deleted: true } }
            }
            return post;
        });
        setFeed(newFeed);
    });

    return (
        <FeedContext value={{ feed, feedSetter, pageOnContext, pageSetter, resetFeed, resetFeedSetter, deletePost, deleteSharedPost }} >
            {children}
        </FeedContext>
    );
}

export default FeedContextProvider;