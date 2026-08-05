import ContentPane from "./components/ContentPane";
import NewPost from "./components/NewPost";
import PostsList from "./components/PostsList";

function MainPage() {


    return (<>
        <div className="main-page">
            <div className="navigation-pane">
                <p>1</p>
            </div>
            <ContentPane />
            <div className="right-pane">
                <p>3</p>
            </div>
        </div>
    </>)
}

export default MainPage;

