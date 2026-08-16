import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchCommentsByUserId, fetchLikedPosts, fetchLikedPostsByUserId, fetchMyComments, fetchMyPosts, fetchPostsByUserId, fetchUserByUsername } from "../api/requests";
import UserPicture from "./components/UserPicture";
import UserBackground from "./components/UserBackground";
import PostsList from "./components/PostsList";
import { useLocation, useNavigate } from "react-router";
import background from "../public/bkgd.png"


function MyPage() {
    const [userData, setUserData] = useState(null);
    const SeeingOptions = Object.freeze({
        POSTS: Symbol("posts"),
        LIKES: Symbol("likes"),
        COMMENTS: Symbol("comments")
    });
    const location = useLocation();
    const parts = location.pathname.split("/");
    console.log(parts)
    const curLocation = parts[2];
    let active = SeeingOptions.POSTS;
    switch (curLocation) {
        case "":
            active = SeeingOptions.POSTS;
            break;
        case "likes":
            active = SeeingOptions.LIKES;
            break;
        case "comments":
            active = SeeingOptions.COMMENTS;
            break;
    }

    const { user, setUser } = useContext(AuthContext);
    const [myPosts, setMyPosts] = useState([]);
    const [seeingOption, setSeeingOption] = useState(SeeingOptions.POSTS)
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    function handleSeePosts() {
        navigate("/" + user.username);
    }

    function handleSeeComments() {
        navigate("/" + user.username + "/comments", { replace: true });
    }

    function handleSeeLikes() {
        navigate("/" + user.username + "/likes", { replace: true });
    }

    function handleEditProfile() {
        navigate("/settings/profile");
    }

    useEffect(() => {
        async function fetchUserData() {
            const result = await fetchUserByUsername(parts[1]);
            console.log(result)
            if (result && result.success) {
                setUserData(result.data)
            }
        }
        fetchUserData();
    }, [])

    useEffect(() => {
        async function getPosts() {
            let response = null;
            if (active == SeeingOptions.POSTS) {
                response = await fetchPostsByUserId(userData.id);
                if (response && response.success) {
                    setMyPosts(response.data);
                }
            }

            if (active == SeeingOptions.LIKES) {
                response = await fetchLikedPostsByUserId(userData.id);
                if (response && response.success) {
                    setMyPosts(response.data.map((item) => item.post));
                }
            }

            if (active == SeeingOptions.COMMENTS) {
                response = await fetchCommentsByUserId(userData.id);
                if (response && response.success) {
                    setMyPosts(response.data.map((item) => { return { ...item, likes: [], bookmarks: [] } }));
                }
            }


        }
        setCount(c => ++c);
        if (userData)
            getPosts();
    }, [location, userData]);
    if (!userData || !user) return <div className="loading"><p>Loading</p></div>
    return (
        <>
            <div className="my-page">
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
                        <p>{userData.name}</p>
                    </div>
                    <UserBackground id={userData.id} />
                    <div className="my-page-controls">
                        <div className="my-page-picture">
                            <UserPicture id={userData.id} useBorder={true} />
                        </div>
                        <button onClick={handleEditProfile} className="edit-profile-button">Edit profile</button>
                    </div>
                    <div className="user-profile-info">
                        <p>{userData.name}</p>
                        <p>@{userData.username}</p>
                    </div>
                    <div className="view-list-options">
                        <div onClick={handleSeePosts} className={`posts-option ${active == SeeingOptions.POSTS ? "active" : ""}`}>
                            <p>Posts</p>
                        </div>
                        <div onClick={handleSeeComments} className={`comments-option ${active == SeeingOptions.COMMENTS ? "active" : ""}`}>
                            <p>Comments</p>
                        </div>
                        <div onClick={handleSeeLikes} className={`likes-option ${active == SeeingOptions.LIKES ? "active" : ""}`}>
                            <p>Likes</p>
                        </div>
                    </div>
                </div>
                <div className="my-page-content">
                    <PostsList key={Date.now()} postsList={myPosts} />
                </div>
            </div>
        </>
    )

}

export default MyPage;


