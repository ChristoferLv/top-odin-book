import { useContext, useEffect, useRef, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { FeedContext } from "../FeedContext";
import { useLocation } from "react-router";

function ContentPane() {
    const { user } = useContext(AuthContext);
    const { feedSetter, feed, pageOnContext, pageSetter } = useContext(FeedContext);
    const [postsList, setPostsList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [scrollAllowed, setScrollAllowed] = useState(false);
    const observerTarget = useRef(null);
    const location = useLocation();


    const isRecovering = useRef(false);

    function updatePostsList(data, top) {
        if (top) {
            sessionStorage.setItem("posts-scroll", 0);
            setPostsList((c) => [data, ...c]);
        } else {
            const oldIds = postsList.map((c) => c.id);
            const treatedNewList = data.filter((c) => !oldIds.includes(c.id));
            setPostsList((c) => [...c, ...treatedNewList]);
        }
    }

    useEffect(() => {
        if (feed.length > 0) {
            isRecovering.current = true;
            setPostsList(feed);
            setPage(pageOnContext);
        } else {
            sessionStorage.setItem("posts-scroll", 0);
        }
    }, []);

    useEffect(() => {
        if (postsList.length === 0) return;

        const savedScroll = sessionStorage.getItem("posts-scroll") || 0;
        window.scrollTo(0, Number(savedScroll));
        setScrollAllowed(true);
    }, [postsList]);



    useEffect(() => {
        const handleScroll = () => {
            const savedScroll = sessionStorage.getItem("posts-scroll");

            if (location.pathname == "/" && feed.length > 0 && scrollAllowed) {
                if (savedScroll > 10 && window.scrollY == 0) return;
                sessionStorage.setItem("posts-scroll", window.scrollY);
            }

        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollAllowed]);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        if (isRecovering.current) {
            if (page === pageOnContext) {
                isRecovering.current = false;
            }
            return;
        }

        async function getPosts(page) {
            if (loading) return;
            setLoading(true);
            try {
                const result = await fetchAllPosts(page, controller.signal, false);
                if (result && result.success) {
                    if (ignore) return;
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        updatePostsList(result.data, false);
                    }
                    feedSetter([...feed, ...result.data]);
                    pageSetter(page);
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        getPosts(page);

        return () => { ignore = true; controller.abort() }
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
    }, [hasMore, loading, postsList]);

    return (<>
        <div className="content-pane">
            <NewPost user={user} updatePosts={updatePostsList} />
            <PostsList hasMore={hasMore} loading={loading} observerRef={observerTarget} postsList={postsList} user={user} onUserPage={false} />
        </div>
    </>)
}



export default ContentPane;