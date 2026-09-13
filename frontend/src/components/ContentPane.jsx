import { useCallback, useContext, useEffect, useRef, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts } from "../../api/requests";
import { AuthContext } from "../AuthContext";

function ContentPane() {
    const { user, setUser } = useContext(AuthContext);
    const [postsList, setPostsList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);
    const lastPage = useRef(0);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getPosts(page) {
            if (loading) return;
            setLoading(true);
            try {
                const result = await fetchAllPosts(page, controller.signal);
                if (result && result.success) {
                    if (ignore) return;
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setPostsList((prev) => [...prev, ...result.data]);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        getPosts(page);

        return () => { ignore = true; controller.abort("abort") }
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && postsList.length != 0) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading]);

    return (<>
        <div className="content-pane">
            <NewPost />
            <PostsList hasMore={hasMore} loading={loading} observerRef={observerTarget} postsList={postsList} user={user} onUserPage={false} />
        </div>
    </>)
}



export default ContentPane;