import { useState } from "react";
import { useNavigate } from "react-router";
import { followUser, unfollowUser } from "../../api/requests";
import UserPicture from "./UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";

function UserCard({ data }) {
    const [nowFollowing, setNowFollowing] = useState(data.following.length > 0);
    const navigate = useNavigate();
    const isFollowingMe = data.followedBy.length !=0;

    async function handleFollow(e) {
        e.stopPropagation();
        if (nowFollowing) {
            const result = await unfollowUser(data.id);
            if (result && result.success) {
                setNowFollowing(false);
            }
            return;
        }

        const result = await followUser(data.id);
        if (result && result.success) {
            setNowFollowing(true);
        }
    }

    function handleSeeUser(e) {
        e.stopPropagation();
        navigate("/" + data.username);
    }

    return (
        <>
            <div className="user-item" onClick={handleSeeUser}>
                <UserPicture id={data.id} username={data.username} size={USER_PICTURE_DEFAULT_SIZE} useBorder={false} />

                <div className="user-infos">
                    <div className="user-item-head">
                        <span>{data.name}</span>
                        <div>
                            <span>@{data.username}</span>
                            {isFollowingMe && <span className="follows-you-tag">Follows you</span>}
                        </div>
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