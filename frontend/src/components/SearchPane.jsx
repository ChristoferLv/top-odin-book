import { useContext, useEffect, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts, searchPosts, searchUsers } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import UsersList from "./UsersList";
import SearchField from "./SearchField";


function SearchPane() {
    const SearchOptions = Object.freeze({
        POSTS: "POSTS",
        PEOPLE: "PEOPLE",
    });

    const { user, setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    // const [searchOption, setSearchOption] = useState(SearchOptions.POSTS);
    const [searchTerm, setSearchTerm] = useState("");
    const [postsList, setPostsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    let searchOption = SearchOptions.POSTS;
    if (searchParams.get("f") == "people") searchOption = SearchOptions.PEOPLE;

    function handleChangeSearchOption(option) {
        if (option == searchOption) return;
        setPostsList([]);
        setUsersList([]);
        // setSearchOption(option);
        const paramsObj = Object.fromEntries([...searchParams]);
        if (!paramsObj.q || paramsObj.q == "") {
            setSearchParams({ f: option.toLowerCase() });
        } else {
            setSearchParams({ ...paramsObj, q: searchTerm, f: option.toLowerCase() });
        }
    }

    // function handleSearchTerm(e) {
    //     setSearchTerm(e.target.value);
    // }

    function handleSearch(value) {
        if (value.length == 0) {
            const paramsObj = Object.fromEntries([...searchParams]);
            const { q, f } = { ...paramsObj };
            if (f == "people") {
                setSearchParams({ "f": f });
            } else {
                setSearchParams({});
            }
            setSearchTerm("");
            return;
        }
        if (searchOption == SearchOptions.POSTS) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({ q: value, f: "people" });
        }
        setSearchTerm(value);
    }

    useEffect(() => {
        // const f = searchParams.get("f");
        // const q = searchParams.get("q");
        // if (!f || (f != "posts" && f != "users") || !q)
        //     setSearchParams({});
        // if (f == "users") {
        //     // setSearchOption(SearchOptions.PEOPLE);
        // }
    }, [location.search]);

    useEffect(() => {
        const controller = new AbortController();

        async function getPosts(searchTerm) {
            try {
                const result = await searchPosts(searchTerm, controller.signal);
                if (result && result.success) {
                    setPostsList(result.data)
                }
            } catch (e) {
                if (controller.signal.aborted)
                    return;
            }
        }

        async function getUsers() {
            try {
                const result = await searchUsers(searchParams.toString(), controller.signal);
                if (result && result.success) {
                    setUsersList(result.data)
                }
            } catch (e) {
                if (controller.signal.aborted)
                    return;
            }
        }

        if (searchParams.get("f") == "people") {
            getUsers();
        } else if (!searchParams.get("f") || searchParams.get("f") == "posts") {
            if (!searchParams.get("q")) {
                getPosts(searchParams.toString());
            } else {
                getPosts(searchParams.toString());
            }
        }

        return () => { setPostsList([]); setUsersList([]); controller.abort("cancel"); }

    }, [location.pathname + location.search]);

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
            {postsList.length != 0 && searchOption == SearchOptions.POSTS && <PostsList postsList={postsList} user={user} onUserPage={false} />}
            {usersList.length != 0 && searchOption == SearchOptions.PEOPLE && <UsersList usersList={usersList} />}
        </div >
    </>)
}



export default SearchPane;