import { useContext, useEffect, useState } from "react";
import { fetchFollowersOfUser, fetchUserByUsername, fetchWhoUserIsFollowing } from "../../api/requests";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate } from "react-router";
import UsersList from "./UsersList";


function FollowageListing() {
    const SearchOptions = Object.freeze({
        FOLLOWING: "FOLLOWING",
        FOLLOWERS: "FOLLOWERS",
    });

    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [usersList, setUsersList] = useState([]);

    const parts = location.pathname.split("/");
    const curLocation = parts.at(-1);
    const userToList = parts.at(-2);
    let searchOption = SearchOptions.FOLLOWING;
    if (curLocation == "followers") searchOption = SearchOptions.FOLLOWERS;


    function handleChangeSearchOption(option) {
        if (option == searchOption) return;

        setUsersList([]);
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

    useEffect(() => {
        const controller = new AbortController();

        async function getFollowersOfUser() {
            try {
                const result = await fetchFollowersOfUser(userToList, controller.signal);
                if (result && result.success) {
                    setUsersList(result.data)
                }
            } catch (e) {
                if (controller.signal.aborted)
                    return;
            }
        }

        async function getWhoUserIsFollowing() {
            try {
                const result = await fetchWhoUserIsFollowing(userToList, controller.signal);
                if (result && result.success) {
                    setUsersList(result.data)
                }
            } catch (e) {
                if (controller.signal.aborted)
                    return;
            }
        }

        if (searchOption == SearchOptions.FOLLOWING) {
            getWhoUserIsFollowing();
        } else {
            getFollowersOfUser();
        }

        return () => { setUsersList([]); controller.abort("cancel"); }

    }, [location.pathname + location.search]);

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
            {usersList.length != 0 && <UsersList usersList={usersList} />}
        </div >
    </>)
}



export default FollowageListing;