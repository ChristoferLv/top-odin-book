import { useEffect, useLayoutEffect, useRef, useState } from "react";
import UserPicture from "./UserPicture";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import { fetchUserByUsername, followUser, unfollowUser } from "../../api/requests";
import { useNavigate } from "react-router";

function UserCardInfos({ username, isMe, hoverRef, updateFollow }) {
    const [userData, setUserData] = useState(null);
    const [nowFollowing, setNowFollowing] = useState(false);
    const [position, setPosition] = useState(null);
    const navigate = useNavigate();
    const posSetted = useRef(false);
    const myRef = useRef(null);

    async function handleFollow(e) {
        e.stopPropagation();
        if (nowFollowing) {
            const result = await unfollowUser(userData.id);
            if (result && result.success) {
                setNowFollowing(false);
                if (updateFollow)
                    updateFollow(false);
            }
            return;
        }

        const result = await followUser(userData.id);
        if (result && result.success) {
            setNowFollowing(true);
            if (updateFollow)
                    updateFollow(true);
        }
    }

    useEffect(() => {
        const rightPane = document.querySelector(".right-pane-content");
        const compensate = rightPane.contains(hoverRef.current)
        const rect = hoverRef.current.getBoundingClientRect();
        const position = {
            x: rect.x - 150,
            y: rect.bottom + window.scrollY + 10
        }

        if (compensate) {
            position.x = position.x - rightPane.getBoundingClientRect().x;
            position.y = position.y - window.scrollY;
        }

        setPosition(position);

    }, []);

    useLayoutEffect(() => {
        if (!userData || !position || !myRef.current) return;
        if (posSetted.current) return;
        posSetted.current = true;

        const card = myRef.current.getBoundingClientRect();
        const isOut = (
            card.bottom > (window.innerHeight || document.documentElement.clientHeight)
        );

        if (!isOut) return;

        const rect = hoverRef.current.getBoundingClientRect();

        setPosition({ ...position, y: position.y - card.height - 15 - rect.height });
    }, [userData, position]);

    useEffect(() => {
        async function fetchUserData() {
            const result = await fetchUserByUsername(username);
            if (result && result.success) {
                setUserData(result.data);
                setNowFollowing(result.data.following.length > 0);
            }
        }
        fetchUserData();

        return () => { setUserData(null); };
    }, []);

    function handleClick(e) {
        e.stopPropagation();
    }

    if (!userData || !position) return null;

    return (
        <>
            <div ref={myRef} className="user-card-hover" onClick={handleClick}
                style={{ top: position.y, left: position.x, zIndex: 999999 }}>
                <div className="card-hover-header">
                    <UserPicture id={userData.id} username={userData.username} size={65} useBorder={false} />
                    {!isMe && <div className="user-item-controls">
                        {nowFollowing ?
                            (
                                <button className="follow-button unfollow" onClick={handleFollow}>Unfollow</button>
                            ) : (
                                <button className="follow-button" onClick={handleFollow}>Follow</button>
                            )
                        }
                    </div>}
                </div>
                <div className="user-info">
                    <p>{userData.name}</p>
                    <span className="username">@{userData.username}</span>
                    {/* {isFollowingMe != 0 && <span className="follows-you-tag">Follows you</span>} */}
                </div>
                <div className="card-hover-bio">
                    {userData.bio.length > 0 && <textarea defaultValue={userData.bio} readOnly />}
                </div>
                <div className="user-followage-info">
                    <div className="count" onClick={(e) => goToFollowagePage("following")}>
                        <span>{userData._count.followedBy}</span>
                        <span> Following</span>
                    </div>
                    <div className="count" onClick={(e) => goToFollowagePage("followers")}>
                        <span>{userData._count.following}</span>
                        <span> Followers</span>
                    </div>
                </div>
            </div>
        </>
    );
}


export default UserCardInfos;