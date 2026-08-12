import { USER_PICTURE_DEFAULT_SIZE } from "../utils/defaults";
import UserPicture from "./UserPicture";

function UserToast({ user, onClick }) {
    return (
        <>
            <div onClick={onClick} className="user-toast">
                <UserPicture size={USER_PICTURE_DEFAULT_SIZE} id={user.id}/>
                <div className="user-toast-info">
                    <p>
                        {user.name}
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