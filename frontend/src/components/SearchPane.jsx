import {  useContext, useEffect,  useRef, useState } from "react";
import PostsList from "./PostsList";
import { searchPosts, searchUsers } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import UsersList from "./UsersList";
import SearchField from "./SearchField";


function SearchPane() {
    const location = useLocation();
    const SearchOptions = Object.freeze({
        POSTS: "POSTS",
        PEOPLE: "PEOPLE",
    });

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ? searchParams.get("q") : "");
    const [postsList, setPostsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    let searchOption = SearchOptions.POSTS;
    if (searchParams.get("f") == "people") searchOption = SearchOptions.PEOPLE;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    const searchKey = location.pathname + location.search;
    const [prevSearchKey, setPrevSearchKey] = useState(searchKey);
    if (prevSearchKey !== searchKey) {
        setPrevSearchKey(searchKey);
        setPage(1);
        setPostsList([]);
        setUsersList([]);
        setHasMore(true);
        setLoading(false); 
    }

    function handleChangeSearchOption(option) {
        if (option == searchOption) return;
        const paramsObj = Object.fromEntries([...searchParams]);
        if (!paramsObj.q || paramsObj.q == "") {
            setSearchParams({ ...paramsObj, f: option.toLowerCase() });
        } else {
            setSearchParams({ ...paramsObj, q: searchTerm, f: option.toLowerCase() });
        }
    }

    function handleSearch(value) {
        const paramsObj = Object.fromEntries([...searchParams]);
        const { q, f, pf } = { ...paramsObj };
        if (value.length == 0) {
            if (f == "people") {
                setSearchParams({ "f": f });
            } else {
                setSearchParams({ "pf": pf });
            }
            setSearchTerm("");
            return;
        }
        if (searchOption == SearchOptions.POSTS) {
            setSearchParams({ pf: pf, q: value });
        } else {
            setSearchParams({ pf: pf, q: value, f: "people" });
        }
        setSearchTerm(value);
    }

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getPosts(searchTerm, page) {
            try {
                if (loading) return;
                setLoading(true);

                const result = await searchPosts(searchTerm, page, controller.signal);
                if (ignore) return;
                if (result && result.success) {
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setPostsList((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }


        async function getUsers(searchTerm, page) {
            try {
                if (loading) return;
                setLoading(true);

                const result = await searchUsers(searchTerm, page, controller.signal);
                if (ignore) return;
                if (result && result.success) {
                    if (result.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setUsersList((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        if (searchParams.get("f") == "people") {
            getUsers(searchParams.toString(), page);
        } else if (!searchParams.get("f") || searchParams.get("f") == "posts") {
            if (!searchParams.get("q")) {
                getPosts(searchParams.toString(), page);
            } else {
                getPosts(searchParams.toString(), page);
            }
        }


        return () => { ignore = true; controller.abort(); }
    }, [searchKey, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && (postsList.length != 0 || usersList.length != 0)) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.1 }
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
        <div className="search-pane">
            <div className="search-pane-header">
                <div className="search-controls">
                    <div onClick={() => navigate(-1)} className="my-page-back-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g>
                        </svg>
                        <div className="tooltip">
                            Back
                        </div>
                    </div>
                    <SearchField key={Date.now()} handleSearch={handleSearch} startSearchTerm={searchTerm} />
                </div>
                <div className="search-options">
                    <div className={`search-option-btn ${searchOption == SearchOptions.POSTS ? "active" : ""}`} onClick={(e) => handleChangeSearchOption(SearchOptions.POSTS)}>
                        <div className="search-option-content">
                            <span>Posts</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.POSTS ? "active" : ""}`}></div>
                        </div>
                    </div>
                    <div className={`search-option-btn ${searchOption == SearchOptions.PEOPLE ? "active" : ""}`} onClick={(e) => handleChangeSearchOption(SearchOptions.PEOPLE)}>
                        <div className="search-option-content">
                            <span>People</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.PEOPLE ? "active" : ""}`}></div>
                        </div>
                    </div>
                </div>
            </div>
            {postsList.length != 0 && searchOption == SearchOptions.POSTS && <PostsList loading={loading} hasMore={hasMore} observerRef={observerTarget} postsList={postsList} user={user} onUserPage={false} />}
            {usersList.length != 0 && searchOption == SearchOptions.PEOPLE && <UsersList loading={loading} hasMore={hasMore} observerRef={observerTarget} usersList={usersList} />}
        </div >
    </>)
}



export default SearchPane;