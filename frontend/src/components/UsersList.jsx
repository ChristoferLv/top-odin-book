import LoadingSpinner from "./LoadingSpinner";
import UserCard from "./UserCard";

function UsersList({ usersList, observerRef, loading, hasMore, }) {
    return (
        <>
            <div className="users-list">
                {usersList.map((user) => {
                    return <UserCard key={user.id} data={user} />
                })}
            </div>
            <div ref={observerRef} style={{ height: "20px", width: "100%", backgroundColor: "red" }}>
                {loading && <LoadingSpinner />}
                {!hasMore && <p>No more items to load.</p>}
            </div>
        </>
    );
}

export default UsersList;