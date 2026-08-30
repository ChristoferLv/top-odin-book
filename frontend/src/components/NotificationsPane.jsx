import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { fetchNotifications } from '../../api/requests'
import UserPicture from './UserPicture';
import { formatDate } from "../utils/dateUtils";


function NotificationsPane() {
    const { user, setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [notificationsList, setNotificationsList] = useState([]);

    useEffect(() => {
        async function getNotifications() {
            const result = await fetchNotifications();
            if (result && result.success) {
                setNotificationsList(result.data)
            }
        }

        getNotifications();

        return () => { setNotificationsList([]); }

    }, []);

    console.log(notificationsList)

    return (<>
        <div className="notifications-pane">
            <div className="notifications-pane-header">
                <div className="my-page-top">
                    <p>Notifications</p>
                </div>
            </div>
            <div className="notifications-list">
                {notificationsList.map((notification) => {
                    return <Notification data={notification} />
                })}
            </div>
        </div >
    </>)
}


function Notification({ data }) {
    let action = "";
    let target = "";
    const formatedDate = formatDate(data.createdAt);

    switch (data.post.postType) {
        case "POST":
        case "SHARE_REPLY":
            target = "post";
            break;
        case "SHARE":
            target = "repost";
            break;
        case "REPLY":
            target = "reply";
            break;
    }

    switch (data.type) {
        case "LIKE":
            action = <p><b>{data.author.name}</b> liked your {target}<span> • {formatedDate}</span></p>
            break;
        case "REPLY":
            action = <p><b>{data.author.name}</b> replied to your {target}<span> • {formatedDate}</span></p>
            break;
        case "SHARE":
            action = <p><b>{data.author.name}</b> shared your {target}<span> • {formatedDate}</span></p>
            break;
    }
    return (
        <>
            <div className="notification-item">
                <div className="notification-type">
                    <div className="notification-icon">
                        {data.type == "LIKE" &&
                            <svg viewBox="0 0 24 24" aria-hidden="true" fill="#f91880"><g>
                                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                            </svg>}
                        {data.type == "SHARE" &&
                            <svg viewBox="0 0 24 24" aria-hidden="true" fill="#00a76f"><g>
                                <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g>
                            </svg>}
                        {data.type == "REPLY" &&
                            <svg viewBox="0 0 24 24" aria-hidden="true" fill="#1a8bd8"><g>
                                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"></path></g>
                            </svg>}
                    </div>
                </div>
                <div className="notification-body">
                    <div className="notification-head">
                        <UserPicture id={data.authorId} size={32} useBorder={false} />
                    </div>
                    <div className="notification-content">
                        {action}
                        <p className="post-content">{data.post.content}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationsPane;