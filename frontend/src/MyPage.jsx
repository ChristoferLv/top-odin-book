import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { deleteFollower, fetchLikedPostsByUserId, fetchPostsByUserId, fetchRepliesByUserId, fetchSharedPostsByUserId, fetchUserByUsername, followUser, unfollowUser } from "../api/requests";
import UserPicture from "./components/UserPicture";
import UserBackground from "./components/UserBackground";
import PostsList from "./components/PostsList";
import { useLocation, useNavigate } from "react-router";

const SeeingOptions = Object.freeze({
    POSTS: Symbol("posts"),
    LIKES: Symbol("likes"),
    SHARES: Symbol("shares"),
    REPLIES: Symbol("replies")
});


function MyPage() {
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const parts = location.pathname.split("/");
    const [previousUser, setPreviousUser] = useState(parts[1]);
    const curLocation = parts[2];
    let active = SeeingOptions.POSTS;
    let showFullReplie = true;
    switch (curLocation) {
        case "":
            active = SeeingOptions.POSTS;
            break;
        case "likes":
            active = SeeingOptions.LIKES;
            break;
        case "shares":
            active = SeeingOptions.SHARES;
            break;
        case "replies":
            active = SeeingOptions.REPLIES;
            showFullReplie = false;
            break;
    }

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isMyProfile = user?.id == userData?.id;
    const isFollowing = userData?.following.length;
    const isFollowingMe = userData?.followedBy.length;


    function handleSeePosts() {
        navigate("/" + userData.username);
    }

    function handleSeeReplies() {
        navigate("/" + userData.username + "/replies", { replace: true });
    }

    function handleSeeShares() {
        navigate("/" + userData.username + "/shares", { replace: true });
    }

    function handleSeeLikes() {
        navigate("/" + userData.username + "/likes", { replace: true });
    }

    function handleEditProfile() {
        navigate("/settings/profile");
    }

    function goToFollowagePage(where) {
        navigate(where);
    }

    async function removeFollower() {
        try {
            const result = await deleteFollower(userData.id);
            if (result && result.success) {
                setUserData({ ...userData, followedBy: [] });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function handleFollowage() {
        if (isFollowing) {
            const result = await unfollowUser(userData.id);
            if (result && result.success) {
                setUserData({ ...userData, following: [] });
            }
            return;
        }

        const result = await followUser(userData.id);
        if (result && result.success) {
            setUserData({ ...userData, following: [result.data.id] });
        }
    }


    useEffect(() => {
        if (previousUser != parts[1]) {
            setPreviousUser(parts[1]);
            setUserData(null);
        }
        async function fetchUserData() {
            const result = await fetchUserByUsername(parts[1]);
            if (result && result.success) {
                setUserData(result.data)
            }
        }
        fetchUserData();
    }, [location.pathname])


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
                        <div className="user-data-header">
                            <p>{userData.name}</p>
                            <p>{userData._count.posts} posts</p>
                        </div>
                    </div>
                    <UserBackground id={userData.id} />
                    <div className="my-page-controls">
                        <div className="my-page-picture">
                            <UserPicture id={userData.id} useBorder={true} />
                        </div>
                        {isMyProfile && <button onClick={handleEditProfile} className="edit-profile-button">Edit profile</button>}
                        {!isMyProfile && isFollowingMe && <button onClick={removeFollower} className={`unfollow-btn remove-follower`}>Remove follower</button>}
                        {!isMyProfile && <button onClick={handleFollowage} className={`${isFollowing ? "unfollow-btn" : "follow-btn"}`}>{isFollowing ? "Following" : "Follow"}</button>}
                    </div>
                    <div className="user-profile-info">
                        <p>{userData.name}</p>
                        <span className="username">@{userData.username}</span>
                        {isFollowingMe != 0 && <span className="follows-you-tag">Follows you</span>}
                    </div>
                    <div className="user-profile-bio">
                        <p>{userData.bio}</p>
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
                    <div className="view-list-options">
                        <div onClick={handleSeePosts} className={`posts-option ${active == SeeingOptions.POSTS ? "active" : ""}`}>
                            <p>Posts</p>
                        </div>
                        <div onClick={handleSeeReplies} className={`replies-option ${active == SeeingOptions.REPLIES ? "active" : ""}`}>
                            <p>Replies</p>
                        </div>
                        <div onClick={handleSeeShares} className={`shares-option ${active == SeeingOptions.SHARES ? "active" : ""}`}>
                            <p>Shares</p>
                        </div>
                        <div onClick={handleSeeLikes} className={`likes-option ${active == SeeingOptions.LIKES ? "active" : ""}`}>
                            <p>Likes</p>
                        </div>
                    </div>
                </div>
                <div className="my-page-content">
                    <InfinitePostsList key={location.pathname + user.id} user={userData} listOption={active} fullReplies={showFullReplie} />
                </div>
            </div>
        </>
    )
}


function InfinitePostsList({ user, listOption, fullReplies }) {
    const [myPosts, setMyPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerTarget = useRef(null);
    const searchKey = location.pathname + location.search;
    const [prevSearchKey, setPrevSearchKey] = useState(searchKey);
    if (prevSearchKey !== searchKey) {
        setUserData(null);
        setPrevSearchKey(searchKey);
        setPage(1);
        setHasMore(true);
        setLoading(false);
    }
    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        async function getPosts(page) {
            if (loading) return;
            setLoading(true);
            let response = null;

            try {
                if (listOption == SeeingOptions.POSTS) {
                    response = await fetchPostsByUserId(user.id, controller.signal, page);
                    if (ignore) return;
                    if (response.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setMyPosts((prev) => [...prev, ...response.data]);
                    }
                }

                if (listOption == SeeingOptions.REPLIES) {
                    response = await fetchRepliesByUserId(user.id, controller.signal, page);
                    if (ignore) return;
                    if (response.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setMyPosts((prev) => [...prev, ...response.data]);
                    }
                }

                if (listOption == SeeingOptions.SHARES) {
                    response = await fetchSharedPostsByUserId(user.id, controller.signal, page);
                    if (ignore) return;
                    if (response.data.length == 0) {
                        setHasMore(false);
                    } else {
                        setMyPosts((prev) => [...prev, ...response.data]);
                    }
                }

                if (listOption == SeeingOptions.LIKES) {
                    response = await fetchLikedPostsByUserId(user.id, controller.signal, page);
                    if (ignore) return;
                    if (response && response.success) {
                        if (response.data.length == 0) {
                            setHasMore(false);
                        } else {
                            setMyPosts((prev) => [...prev, ...response.data]);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        getPosts(page);

        return () => { ignore = true; controller.abort("abort") };
    }, [searchKey, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && myPosts.length != 0) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading]);

    return (
        <>
            <PostsList key={searchKey} observerRef={observerTarget} hasMore={hasMore} loading={loading} postsList={myPosts} user={user} onUserPage={fullReplies} />
        </>
    );
}





export default MyPage;


