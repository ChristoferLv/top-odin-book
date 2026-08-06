import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchMyPosts } from "../api/requests";


function MyPage() {
    const { user, setUser } = useContext(AuthContext);
    const [myPosts, setMyPosts] = useState();

    useEffect(() => {
        async function getMyPosts() {
            const response = fetchMyPosts();
            if (response && response.success) {
                setMyPosts(response.data);
            }
        }

        getMyPosts();
    });

    if (!user) return <div className="loading"><p>Loading</p></div>

    return (
        <>
            <div className="my-page">
                <div className="my-page-header">
                    <p>{user.username}</p>
                    <p>{new Date(user.createdAt).toLocaleString()}</p>
                </div>
                <div className="my-page-content"></div>
            </div>
        </>
    )

}

export default MyPage;


