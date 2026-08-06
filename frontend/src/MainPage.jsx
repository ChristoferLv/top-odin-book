import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import NewPost from "./components/NewPost";
import { Outlet, useNavigate } from "react-router";

function MainPage() {
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    function goHome() {
        navigate("/");
    }

    function goToBookmarks() {
        navigate("/");
    }

    function goToProfile() {
        navigate("/" + user.username);
    }



    if (isLoading) return <><p>Loading...</p></>;
    if (!user && !isLoading) return <Navigate to="/login" replace />

    return (<>
        <div className="main-page">
            <div className="navigation-pane">
                <div onClick={goHome} className="navigation-button">
                    <div className="navigation-button-inner">
                        <div className="navigation-icon active">
                            <svg fill="#000000" width="800px" height="800px" fill="currentColor" viewBox="-2 3 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.469 12.594l3.625 3.313c0.438 0.406 0.313 0.719-0.281 0.719h-2.719v8.656c0 0.594-0.5 1.125-1.094 1.125h-4.719v-6.063c0-0.594-0.531-1.125-1.125-1.125h-2.969c-0.594 0-1.125 0.531-1.125 1.125v6.063h-4.719c-0.594 0-1.125-0.531-1.125-1.125v-8.656h-2.688c-0.594 0-0.719-0.313-0.281-0.719l10.594-9.625c0.438-0.406 1.188-0.406 1.656 0l2.406 2.156v-1.719c0-0.594 0.531-1.125 1.125-1.125h2.344c0.594 0 1.094 0.531 1.094 1.125v5.875z"></path>
                            </svg>
                        </div>
                        Home
                    </div>
                </div>
                <div onClick={goToBookmarks} className="navigation-button">
                    <div className="navigation-button-inner">
                        <div className="navigation-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="-3 -2 21 21">
                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                            </svg>
                        </div>
                        Bookmarks
                    </div></div>
                <div onClick={goToProfile} className="navigation-button">
                    <div className="navigation-button-inner">
                        <div className="navigation-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                        </div>
                        Profile
                    </div>
                </div>
            </div>
            <Outlet />
            <div className="right-pane">
                <p>3</p>
            </div>
        </div>
    </>)
}

export default MainPage;

