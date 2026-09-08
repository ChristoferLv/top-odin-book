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