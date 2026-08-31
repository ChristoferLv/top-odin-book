import { useEffect, useState } from "react"
import { fetchNotificationsCount } from "../../api/requests";

function NotificationsCount({ user }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function getNotificationCount() {
            const result = await fetchNotificationsCount();
            if (result && result.success) {
                setCount(result.data);
            }
        }

        getNotificationCount();
    });

    if (count == 0) return null;

    return (<>
        <div className="notifications-count">
            <p>{count}</p>
        </div>
    </>
    );
}

export default NotificationsCount;