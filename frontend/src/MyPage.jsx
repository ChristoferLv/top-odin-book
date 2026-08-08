import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchMyPosts } from "../api/requests";
import UserPicture from "./components/UserPicture";
import UserBackground from "./components/UserBackground";
import PostsList from "./components/PostsList";
import { useNavigate } from "react-router";



function MyPage() {
    const { user, setUser } = useContext(AuthContext);
    const [myPosts, setMyPosts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function getMyPosts() {
            const response = await fetchMyPosts();
            if (response && response.success) {
                setMyPosts(response.data);
            }
        }

        getMyPosts();
    }, []);

    if (!user) return <div className="loading"><p>Loading</p></div>

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
                        <p>{user.username}</p>
                    </div>
                    <UserBackground />
                    <div className="my-page-controls">
                        <div className="my-page-picture">
                            <UserPicture />
                        </div>
                        <button className="edit-profile-button">Edit profile</button>
                    </div>
                    <div className="user-profile-info">
                        <p>{user.username}</p>
                        <p>@{user.username}</p>
                    </div>
                </div>
                <div className="my-page-content">
                    <PostsList postsList={myPosts} />
                </div>
            </div>
        </>
    )

}

export default MyPage;


