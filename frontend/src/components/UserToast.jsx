import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import UserPicture from "./UserPicture";

function UserToast({ user }) {
    return (
        <>
            <div className="user-toast">
                <UserPicture size={USER_PICTURE_DEFAULT_SIZE} />
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