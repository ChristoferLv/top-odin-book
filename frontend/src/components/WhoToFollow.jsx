import { getFollowSuggestions } from "../../api/requests";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

function WhoToFollow() {
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        async function getAllUsers() {
            const result = await getFollowSuggestions();
            if (result && result.success) {
                setUsersList(result.data);
            }
        }
        getAllUsers();
    }, []);

    return (
        <>
            <div className="who-to-follow">
                <p>Who to follow</p>
                <div className="users-list">
                    {usersList.map((user) => {
                        return <UserCard key={user.id} data={user} />
                    })}
                </div>
            </div>
        </>
    );
}



export default WhoToFollow;