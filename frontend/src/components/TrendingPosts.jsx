import { fetchPostMidia, fetchTrendingPosts } from "../../api/requests";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import UserPicture from "./UserPicture";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from "react-router";
import PostMidia from "./PostMidia";
import hoverTimer from "../OnHoverTimer";
import UserCardInfos from "./UserCardInfos";
import { AuthContext } from "../contexts/AuthContext";

function TrendingPosts() {
    const [postsList, setPostsList] = useState([]);
    const { user, isLoading } = useContext(AuthContext);


    useEffect(() => {
        async function getTrendingPosts() {
            const result = await fetchTrendingPosts();
            if (result && result.success) {
                setPostsList(result.data);
            }
        }
        getTrendingPosts();
    }, []);

    if (isLoading) return null;
    if (postsList.length == 0)
        return <>
            <div className="trending-posts">
                <p>No trending posts for now!</p>
            </div >
        </>

    return (
        <>
            <div className="trending-posts">
                <p>Trending</p>
                <div className="trending-posts-list">
                    {postsList.map((post) => {
                        return <MiniPostItem key={post.id} data={post.post} user={user} />
                    })}
                </div>
            </div>
        </>
    );
}


function MiniPostItem({ data, user }) {
    const navigate = useNavigate();
    const { isOpen, hoverRef, handleMouseEnter, handleMouseLeave } = hoverTimer();
    const { isOpen: imageIsOpen, hoverRef: hoverRefImage, handleMouseEnter: handleMouseEnterImage, handleMouseLeave: handleMouseLeaveImage } = hoverTimer();
    const onlyPicture = (!data.content && data.hasMidia);
    const formatedDate = formatDate(data.createdAt);

    function handleSeeAuthor(e) {
        e.stopPropagation();
        navigate(`/${data.author.username}`);
    }

    function handleSeePost(e) {
        e.stopPropagation();
        navigate(`/${data.author.username}/post/${data.id}`);
    }

    const [midiaBuff, setMidia] = useState(null);
    const [mime, setMime] = useState(null);

    function handleSeePicture(e) {
        e.stopPropagation();
        navigate(`/${data.author.username}/post/${data.id}`);
    }


    useEffect(() => {
        async function getMidia() {
            const midia = await fetchPostMidia(data.id);
            setMidia(midia.data.content?.data);
            setMime(midia.data.mime);
        }
        if (data.hasMidia)
            getMidia();
    }, []);

    const rawBuffer = new Uint8Array(midiaBuff);
    const blob = new Blob([rawBuffer], { type: mime });
    const imageUrl = URL.createObjectURL(blob);

    return (
        <>
            <div className="mini-post">
                <div className="card-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {isOpen && <UserCardInfos key={data.author.username} username={data.author.username} hoverRef={hoverRef} isMe={data.author.id == user.id} />}
                </div>
                <div className="compact-post-head" onClick={handleSeeAuthor}>
                    <div className="picture-wrap" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <UserPicture id={data.author.id} username={data.author.username} size={20} useBorder={false} />
                    </div>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className="post-name">{data.author.name}</span>
                    </div>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className="post-username">@{data.author.username} • {formatedDate}</span>
                    </div>
                </div>
                <div className="mini-post-body" onClick={handleSeePost}>
                    {onlyPicture ?
                        (<div className="only-midia-wrap" onMouseEnter={handleMouseEnterImage} onMouseLeave={handleMouseLeaveImage}>
                            <div className="card-container" onMouseEnter={handleMouseEnterImage} onMouseLeave={handleMouseLeaveImage}>
                                {imageIsOpen && <PictureHoverCard key={data.id} picture={imageUrl} hoverRef={hoverRefImage} />}
                            </div>
                            <div className="midia"
                                onClick={handleSeePicture}
                            >
                                {midiaBuff ? (
                                    <img
                                        src={imageUrl}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div />
                                )}
                            </div>
                            <p>[Click to see more]</p>
                        </div>)
                        : (<p className="multi-line-truncate">{data.content}</p>)
                    }
                </div>
            </div>
        </>
    );
}

function PictureHoverCard({ picture, hoverRef }) {
    const [position, setPosition] = useState(null);
    const posSetted = useRef(false);
    const myRef = useRef(null);

    useEffect(() => {
        const rightPane = document.querySelector(".right-pane-content");
        const compensate = rightPane.contains(hoverRef.current)
        const rect = hoverRef.current.getBoundingClientRect();
        const position = {
            x: rect.x,
            y: rect.bottom + window.scrollY + 10
        }

        if (compensate) {
            position.x = position.x - rightPane.getBoundingClientRect().x;
            position.y = position.y - window.scrollY;
        }

        setPosition(position);

    }, []);

    useLayoutEffect(() => {
        if (!position || !myRef.current) return;
        if (posSetted.current) return;
        posSetted.current = true;

        const card = myRef.current.getBoundingClientRect();
        const isOut = (
            card.bottom > (window.innerHeight || document.documentElement.clientHeight)
        );

        if (!isOut) return;

        const rect = hoverRef.current.getBoundingClientRect();

        setPosition({ ...position, y: position.y - card.height - 15 - rect.height });
    }, [position]);

    function handleClick(e) {
        e.stopPropagation();
    }

    if (!position) return null;

    return (
        <>
            <div ref={myRef} className="picture-card-hover" onClick={handleClick}
                style={{ top: position.y, left: position.x, zIndex: 999999 }}>

                <img src={picture} alt="" />
            </div>
        </>
    );
}

export default TrendingPosts;