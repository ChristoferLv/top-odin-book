import { useState } from "react";
import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import UserPicture from "./UserPicture";
import { followUser, unfollowUser } from "../../api/requests";
import { useNavigate } from "react-router";
import UserCard from "./UserCard";

function UsersList({ usersList }) {

    return (
        <div className="users-list">
            {usersList.map((user) => {
                return <UserCard key={user.id} data={user} />
            })}
        </div>
    );
}

export default UsersList;