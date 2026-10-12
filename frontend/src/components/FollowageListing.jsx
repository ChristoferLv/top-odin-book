import { useContext, useEffect, useRef, useState } from "react";
import { fetchFollowersOfUser, fetchUserByUsername, fetchWhoUserIsFollowing } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate } from "react-router";
import UsersList from "./UsersList";

const SearchOptions = Object.freeze({
    FOLLOWING: "FOLLOWING",
    FOLLOWERS: "FOLLOWERS",
});

function FollowageListing() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const parts = location.pathname.split("/");
    const curLocation = parts.at(-1);
    const userToList = parts.at(-2);
    let searchOption = SearchOptions.FOLLOWING;
    if (curLocation == "followers") searchOption = SearchOptions.FOLLOWERS;

    function handleChangeSearchOption(option) {
        if (option == searchOption) return;

        if (option == SearchOptions.FOLLOWING) {
            navigate(`/${userToList}/following`);
        }
        if (option == SearchOptions.FOLLOWERS) {
            navigate(`/${userToList}/followers`);
        }
    }

    useEffect(() => {
        setUserData(null);
        async function fetchUserData() {
            const result = await fetchUserByUsername(userToList);
            if (result && result.success) {
                setUserData(result.data)
            }
        }
        fetchUserData();
    }, []);

    if (!userData || !user) return <div className="loading"><p>Loading</p></div>

    return (<>
        <div className="followage-pane">
            <div className="followage-pane-header">
                <div className="followage-top">
                    <div onClick={() => navigate(-1)} className="my-page-back-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                        </svg>
                        <div className="tooltip">
                            Back
                        </div>
                    </div>
                    <div className="user-data-header">
                        <p>{userData.name}</p>
                        <p>@{userData.username}</p>
                    </div>
                </div>
                <div className="search-options">
                    <div className={`search-option-btn ${searchOption == SearchOptions.FOLLOWERS ? "active" : ""}`} onClick={(e) => handleChangeSearchOption(SearchOptions.FOLLOWERS)}>
                        <div className="search-option-content">
                            <span>Followers</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.FOLLOWERS ? "active" : ""}`}></div>
                        </div>
                    </div>
                    <div className={`search-option-btn ${searchOption == SearchOptions.FOLLOWING ? "active" : ""}`} onClick={(e) => handleChangeSearchOption(SearchOptions.FOLLOWING)}>
                        <div className="search-option-content">
                            <span>Following</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.FOLLOWING ? "active" : ""}`}></div>
                        </div>
                    </div>
                </div>
            </div>
            <InfiniteFollowageList key={location.pathname + user.id} listOption={searchOption} userToList={userToList} />
        </div >
    </>)
}



function InfiniteFollowageList({ userToList, listOption }) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const location = useLocation();

    const observerTarget = useRef(null);
    const searchKey = location.pathname + location.search;
    const [prevSearchKey, setPrevSearchKey] = useState(searchKey);
    if (prevSearchKey !== searchKey) {
        setPrevSearchKey(searchKey);
        setPage(1);
        setHasMore(true);
        setLoading(false);
    }
    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getFollowage(page) {
            if (loading) return;
            setLoading(true);

            try {
                if (listOption == SearchOptions.FOLLOWING) {
                    const result = await fetchWhoUserIsFollowing(userToList, controller.signal, page);
                    if (ignore) return;
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setUsersList((prev) => [...prev, ...result.data]);
                    }
                } else {
                    const result = await fetchFollowersOfUser(userToList, controller.signal, page);
                    if (ignore) return;
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setUsersList((prev) => [...prev, ...result.data]);
                    }
                }
            } catch (e) {
                if (controller.signal.aborted)
                    return;
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        getFollowage(page);

        return () => { ignore = true; controller.abort(); };
    }, [searchKey, page]);

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

    if (usersList.length == 0 && !loading) {
        if (listOption == SearchOptions.FOLLOWING) {
            return (
                <div className="list-empty">
                    <p>You are not following anyone.</p>
                </div>
            );
        } else {
            return (
                <div className="list-empty">
                    <p>You do not have followers.</p>
                </div>
            );
        }
    }

    return (
        <>
            {usersList.length != 0 && <UsersList key={searchKey} usersList={usersList} hasMore={hasMore} loading={loading} observerRef={observerTarget} />}
        </>
    );
}



export default FollowageListing;