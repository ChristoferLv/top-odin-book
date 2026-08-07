import UserPicture from "./UserPicture";

function UserToast({ user }) {
    return (
        <>
            <div className="user-toast">
                <UserPicture size={35} />
                <div className="user-toast-info">
                    <p>
                        {user.username}
                    </p>
                    <p>
                        @{user.username}
                    </p>
                </div>
            </div>
        </>
    )
}


export default UserToast;