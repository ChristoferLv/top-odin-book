import { useEffect, useState } from "react";
import { fetchAllUsers, followUser, unfollowUser } from "../api/requests";
import UserPicture from "./components/UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "./utils/defaults";
import { useNavigate } from "react-router";

function UsersPage() {
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getAllUsers() {
            const result = await fetchAllUsers();
            if (result && result.success) {
                setUsersList(result.data);
            }
        }
        getAllUsers();
    }, []);

    console.log(usersList)


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

                <div className="comments-list">
                    {usersList.map((user) => {
                        return <User key={user.id} data={user} />
                    })}
                </div>
            </div>
        </>
    );
}

function User({ data }) {
    const [userData, setUserData] = useState(data);

    async function handleFollow(e) {
        e.stopPropagation();
        if (userData.following.length) {
            const result = await unfollowUser(userData.id);
            console.log(result)
            if (result && result.success) {
                setUserData({ ...userData, following: [] });
            }
            return;
        }

        const result = await followUser(userData.id);
        console.log(result)
        if (result && result.success) {
            setUserData({ ...userData, following: [{ id: result.data.id }] });
        }
    }

    console.log(userData)

    return (
        <>
            <div className="post-body">
                <UserPicture id={userData.id} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />
                <div className="post-data">
                    <div className="post-head">
                        <span>{userData.name}</span>
                        <span>@{userData.username}</span>
                    </div>
                    <div className="post-controls">
                        {userData.following.length ?
                            (
                                <button className="follow-button" onClick={handleFollow}>Unfollow</button>
                            ) : (
                                <button className="follow-button" onClick={handleFollow}>Follow</button>
                            )
                        }
                    </div>
                </div>
            </div >
        </>
    );
}

export default UsersPage;