import { fetchTrendingPosts, getFollowSuggestions } from "../../api/requests";
import { use, useEffect, useState } from "react";
import UserCard from "./UserCard";
import UserPicture from "./UserPicture";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from "react-router";

function TrendingPosts() {
    const [postsList, setPostsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        async function getTrendingPosts() {
            const result = await fetchTrendingPosts();
            if (result && result.success) {
                setPostsList(result.data);
            }
            setIsLoading(false);
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
                        return <MiniPostItem key={post.id} data={post.post} />
                    })}
                </div>
            </div>
        </>
    );
}


function MiniPostItem({ data }) {
    const navigate = useNavigate();
    const content = (!data.content && data.hasMidia) ? "[Midia post. Click to see]" : data.content;
    const formatedDate = formatDate(data.createdAt);

    function handleSeeAuthor(e) {
        e.stopPropagation();
        navigate(`/${data.author.username}`);
    }

    function handleSeePost(e) {
        e.stopPropagation();
        navigate(`/${data.author.username}/post/${data.id}`);
    }

    return (
        <>
            <div className="mini-post">
                <div className="compact-post-head" onClick={handleSeeAuthor}>
                    <UserPicture id={data.author.id} username={data.author.username} size={20} useBorder={false} />
                    <span>{data.author.name}</span>
                    <span>@{data.author.username} • {formatedDate}</span>
                </div>
                <div className="mini-post-body" onClick={handleSeePost}>
                    {}
                    <p className="multi-line-truncate">{content}</p>
                </div>
            </div>
        </>
    );
}


export default TrendingPosts;