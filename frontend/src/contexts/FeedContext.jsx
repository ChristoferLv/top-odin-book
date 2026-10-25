import { createContext, useCallback, useState } from "react";
import { fetchAllPosts } from "../../api/requests";

export const FeedContext = createContext({
    feed: [],
    feedSetter: () => { },
    pageOnContext: 0,
    pageSetter: () => { },
    deletePost: () => { },
    updateFeed: () => { },
    feedCount: 0
});


function FeedContextProvider({ children }) {
    const [feed, setFeed] = useState([]);
    const [pageOnContext, setPageOnContext] = useState(0);
    const [feedCount, setFeedCount] = useState(0);

    const feedSetter = useCallback((value) => {
        setFeed(value);
    }, []);

    const pageSetter = useCallback((value) => {
        setPageOnContext(value);
    }, []);

    const deletePost = useCallback(async () => {
        try {
            const newFeed = await fetchAllPosts(pageOnContext, null, true);
            if (newFeed && newFeed.success) {
                setFeed(newFeed.data);
            } else {
                setFeed([]);
                setPageOnContext(1);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    const updateFeed = useCallback((postId, newValues) => {
        setFeedCount(c => c + 1);
        const newFeed = feed.map((post) => {
            if (post.sharedPost && post.sharedPost.id == postId) {
                const updatedValues = { ...post.sharedPost, ...newValues };
                return { ...post, sharedPost: updatedValues };
            }

            if (post.originalPost && post.originalPost.id == postId) {
                const updatedValues = { ...post.originalPost, ...newValues };
                return { ...post, originalPost: updatedValues };
            }

            if (post.id == postId) {
                const updatedValues = { ...post, ...newValues };
                return updatedValues;
            }

            return post;
        });

        setFeed(newFeed);
    }, [feed]);

    return (
        <FeedContext value={{ feed, feedSetter, pageOnContext, pageSetter, deletePost, updateFeed, feedCount }} >
            {children}
        </FeedContext>
    );
}

export default FeedContextProvider;