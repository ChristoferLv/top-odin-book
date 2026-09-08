import { useState } from "react";
import { useNavigate } from "react-router";
import { followUser, unfollowUser } from "../../api/requests";
import UserPicture from "./UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";

function UserCard({ data }) {
    const [userData, setUserData] = useState(data.id ? data : data.following);
    const [nowFollowing, setNowFollowing] = useState(data.id ? data.following?.length : data.following);
    const navigate = useNavigate();

    function goToUser() {
        navigate(`/${data.username}`)
    }

    async function handleFollow(e) {
        e.stopPropagation();
        if (nowFollowing) {
            const result = await unfollowUser(userData.id);
            if (result && result.success) {
                setNowFollowing(false);
            }
            return;
        }

        const result = await followUser(userData.id);
        if (result && result.success) {
            setNowFollowing(true);
        }
    }

    function handleSeeUser() {
        navigate("/" + userData.username);
    }

    return (
        <>
            <div className="user-item" onClick={handleSeeUser}>
                <UserPicture id={userData.id} username={userData.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />

                <div className="user-infos">
                    <div className="user-item-head" onClick={goToUser}>
                        <span>{userData.name}</span>
                        <span>@{userData.username}</span>
                    </div>
                    <div className="user-item-controls">
                        {nowFollowing ?
                            (
                                <button className="follow-button unfollow" onClick={handleFollow}>Unfollow</button>
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

export default UserCard;