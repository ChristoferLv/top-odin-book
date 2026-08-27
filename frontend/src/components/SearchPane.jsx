import { useContext, useEffect, useState } from "react";
import NewPost from "./NewPost";
import PostsList from "./PostsList";
import { fetchAllPosts } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router";

function SearchPane() {
    const SearchOptions = Object.freeze({
        POSTS: "POSTS",
        PEOPLE: "PEOPLE",
    });

    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchOption, setSearchOption] = useState(SearchOptions.POSTS);
    const [searchTerm, setSearchTerm] = useState("");
    const [postsList, setPostsList] = useState([]);

    function handleCHangePostOption(option) {
        setSearchOption(option);
    }

    function handleSearchTerm(e) {
        setSearchTerm(e.target.value);
    }

    function handleSearch(e) {
        e.preventDefault();
    }

    useEffect(() => {
        async function getPosts() {
            const result = await fetchAllPosts();
            if (result && result.success) {
                setPostsList(result.data)
            }
        }

        getPosts();
    }, []);

    console.log(searchOption == SearchOptions.POSTS)

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
                    <div className="search-field">
                        <div className="search-icon">
                            <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1tjplnt r-1bwzh9t r-10ptun7 r-2dysd3 r-1janqcz"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
                        </div>
                        <form action="">
                            <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchTerm} />
                        </form>
                    </div>
                </div>
                <div className="search-options">
                    <div className={`search-option-btn ${searchOption == SearchOptions.POSTS ? "active" : ""}`} onClick={(e) => handleCHangePostOption(SearchOptions.POSTS)}>
                        <div className="search-option-content">
                            <span>Posts</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.POSTS ? "active" : ""}`}></div>
                        </div>
                    </div>
                    <div className={`search-option-btn ${searchOption == SearchOptions.PEOPLE ? "active" : ""}`} onClick={(e) => handleCHangePostOption(SearchOptions.PEOPLE)}>
                        <div className="search-option-content">
                            <span>People</span>
                            <div className={`option-indicator ${searchOption == SearchOptions.PEOPLE ? "active" : ""}`}></div>
                        </div>
                    </div>
                </div>
            </div>
            <PostsList postsList={postsList} user={user} onUserPage={false} />
        </div >
    </>)
}



export default SearchPane;