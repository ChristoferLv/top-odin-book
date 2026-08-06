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
                        Home
                    </div>
                </div>
                <div onClick={goToBookmarks} className="navigation-button">
                    <div className="navigation-button-inner">
                        Bookmarks
                    </div></div>
                <div onClick={goToProfile} className="navigation-button">
                    <div className="navigation-button-inner">
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

