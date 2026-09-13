import { useEffect, useRef, useState } from "react";
import { fetchAllUsers, followUser, unfollowUser } from "../api/requests";
import { useNavigate } from "react-router";
import UsersList from "./components/UsersList";

function UsersPage() {
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    useEffect(() => {
        document.getElementById("master-pane").scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getAllUsers() {
            if (loading) return;
            setLoading(true);
            try {
                const result = await fetchAllUsers(controller.signal, page);
                if (ignore) return;
                if (result && result.success) {
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setUsersList((prev) => [...prev, ...result.data]);
                    }
                }
            } catch (e) {
                if (e.name === 'AbortError') {
                    // Safely ignore or log the cancellation
                    console.log('Fetch aborted gracefully');
                    return;
                }
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        getAllUsers();

        return () => { ignore = true; controller.abort("cancel") }

    }, [page]);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && usersList.length != 0) {
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


    return (
        <>
            <div className="post-page">
                <div className="my-page-header">
                    <div className="my-page-top">
                        <div onClick={() => navigate(-1)} className="my-page-back-button">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                            </svg>
                            <div className="tooltip">
                                Back
                            </div>
                        </div>
                        <p>Users</p>
                    </div>
                </div>

                <UsersList usersList={usersList} hasMore={hasMore} loading={loading} observerRef={observerTarget} />
            </div>
        </>
    );
}

export default UsersPage;