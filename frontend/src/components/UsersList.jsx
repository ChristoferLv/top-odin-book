import { useState } from "react";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import UserPicture from "./UserPicture";

function UsersList({ usersList }) {

    return (
        <div className="comments-list">
            {usersList.map((user) => {
                return <UserCard key={user.id} data={user} />
            })}
        </div>
    );
}


function UserCard({ data }) {
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

export default UsersList;