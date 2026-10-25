import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Navigate, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router";
import UserToast from "./components/UserToast";
import NotificationsCount from "./components/NotificationsCount";
import WhoToFollow from "./components/WhoToFollow";
import SearchInput from "./components/SearchInput";
import SearchFilter from "./components/SearchFilter";
import TrendingPosts from "./components/TrendingPosts";
import { FeedContext } from "./contexts/FeedContext";


function useBidirectionalSticky(scrollContainerEl) {
    const wrapperRef = useRef(null);
    const contentRef = useRef(null);
    const lastY = useRef(0);
    const revealOffset = useRef(0);

    useEffect(() => {
        const scrollEl = scrollContainerEl || window;

        const getScrollY = () =>
            scrollEl === window ? window.scrollY : scrollEl.scrollTop;

        const getViewportHeight = () =>
            scrollEl === window ? window.innerHeight : scrollEl.clientHeight;

        lastY.current = getScrollY();
        let ticking = false;

        function update() {
            const wrapper = wrapperRef.current;
            const content = contentRef.current;
            if (!wrapper || !content) return;

            const currentY = getScrollY();
            const delta = currentY - lastY.current;
            lastY.current = currentY;

            const overflow = Math.max(0, content.offsetHeight - getViewportHeight());

            if (overflow === 0) {
                content.style.top = "0px";
                revealOffset.current = 0;
                return;
            }

            const wrapperTop = wrapper.getBoundingClientRect().top;

            if (wrapperTop > 0) {
                revealOffset.current = 0;
                content.style.top = "0px";
                return;
            }

            revealOffset.current = Math.min(
                overflow,
                Math.max(0, revealOffset.current + delta)
            );
            content.style.top = `-${revealOffset.current}px`;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        }

        scrollEl.addEventListener("scroll", onScroll, { passive: true });
        return () => scrollEl.removeEventListener("scroll", onScroll);
    }, [scrollContainerEl]);

    return { wrapperRef, contentRef };
}

function MainPage() {
    const { wrapperRef, contentRef } = useBidirectionalSticky();
    const ActivePage = Object.freeze({
        HOME: "HOME",
        BOOKMARKS: "BOOKMARKS",
        PROFILE: "PROFILE",
        SEARCH: "SEARCH",
        USERS: "USERS",
        NOTIFICATIONS: "notifications"
    });
    const location = useLocation();
    const parts = location.pathname.split("/");
    const curLocation = parts[1];
    let active = ActivePage.HOME;
    switch (curLocation) {
        case "":
            active = ActivePage.HOME;
            break;
        case "bookmarks":
            active = ActivePage.BOOKMARKS;
            break;
        case "search":
            active = ActivePage.SEARCH;
            break;
        case "notifications":
            active = ActivePage.NOTIFICATIONS;
            break;
        case "users":
            active = ActivePage.USERS;
            break;
        default:
            active = ActivePage.PROFILE;
            break;
    }


    const { feedSetter, pageSetter} = useContext(FeedContext);
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [count, setCount] = useState(1);


    function resetContext() {
        feedSetter([]);
        pageSetter(1);
    }

    function goHome() {
        if (location.pathname == "/") {
            resetContext();
            setCount(c => c + 1);
        }
        navigate("/");
    }

    function goToExplore() {
        navigate("/search");
    }

    function goToNotifications() {
        navigate("/notifications");
    }

    function goToBookmarks() {
        navigate("/bookmarks");
    }

    function goToAllUsers() {
        navigate("/users");
    }

    function goToProfile() {
        navigate("/" + user.username);
    }

    if (isLoading) return <><p>Loading...</p></>;
    if (!user && !isLoading) return <Navigate to="/login" replace />

    return (<>
        <div className="main-page">
            <header>
                <div className="navigation-pane">
                    <div onClick={goHome} className="navigation-button">
                        <div className="main-button-inner">
                            <div className="main-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 882 881" width="882" height="881" transform="matrix(-1,0,0,1,0,0)">
                                    <path d="M442.21 336.89C445.57 334.1 447.75 329.48 450.24 325.9C455.83 317.86 461.58 309.89 467.25 301.89C483.61 278.81 499.84 255.58 516.04 232.36C521.99 223.83 527.89 215.26 533.92 206.79C535.71 204.29 538.03 198.98 540.67 197.41C543.4 195.8 549.29 196.79 552.48 196.88C561.86 197.17 571.24 196.79 580.62 196.93C606.3 197.31 632.2 197.53 657.88 196.97C666.81 196.78 689.26 195.33 697 197.56C693.24 204.06 688.4 210.03 684.13 216.2C674.82 229.67 665.27 242.96 655.95 256.42C627 298.21 597.36 339.54 568.52 381.41C557.15 397.91 545.44 414.18 534.05 430.67C531.83 433.87 521.7 446.6 521.56 449.47C521.4 452.94 529.6 462.5 531.81 465.69C542.34 480.88 553.19 495.86 563.63 511.11C590.93 551 619.17 590.26 646.76 629.95C655.45 642.45 664.27 654.86 672.96 667.36C676.66 672.68 681.1 677.91 684.11 683.63C678.76 685.48 671.59 684.45 665.84 684.38C654.88 684.24 643.9 684.47 632.94 684.34C608.52 684.06 584.1 684.73 559.68 684.34C549.27 684.18 538.69 685.17 528.31 684.37C491.81 632.62 455.3 580.87 418.79 529.12C486.23 432.28 553.68 335.44 621.12 238.61C616.98 237.28 611.6 238.12 607.18 238.16C596.45 238.25 585.71 238.19 574.99 238.21C570.52 238.22 562.76 236.47 558.85 238.97C555.61 241.03 545.98 256.84 543.06 261C531.55 277.37 519.99 293.71 508.58 310.17C480.16 351.15 451.28 391.85 422.68 432.74C410.98 449.48 398.59 465.88 387.48 483.02C383.34 481.11 374.81 466.37 371.49 461.77C357.96 443.02 345.33 423.62 332.13 404.59C284.16 335.45 235.7 266.48 187.28 197.56C191.18 194.64 199.88 196.38 204.81 196.3C219.81 196.09 234.87 196.62 249.87 196.35C272.89 195.95 296.07 195.99 319.08 196.43C324.12 196.52 339.19 194.94 343.01 196.62C345.79 197.84 348.46 203.8 350.18 206.28C355.89 214.51 361.64 222.72 367.43 230.9C384.66 255.28 401.73 279.77 418.81 304.25C423.99 311.68 429.18 319.1 434.39 326.5C436.77 329.87 438.98 334.36 442.21 336.89ZM325.52 237.96C320.83 236.44 315.15 237.61 310.23 237.49C299.37 237.22 288.1 236.85 277.23 237.47C273.08 237.71 266.56 235.96 263.23 238.61C265.43 243.53 269.44 248.09 272.58 252.49C279.29 261.89 285.97 271.34 292.5 280.87C311.66 308.84 331.77 336.17 350.85 364.21C358.64 375.66 366.9 386.79 374.69 398.25C377.88 402.94 382.9 412.28 387.48 415.11C391.51 411.59 394.24 406.08 397.24 401.66C401.66 395.14 406.45 388.86 410.85 382.3C412.71 379.51 417.77 374.82 417.77 371.39C417.76 367.73 413.15 363.07 411.14 360.23C405.14 351.74 399.06 343.28 393.19 334.7C370.95 302.23 347.35 270.66 325.52 237.96ZM496.93 484.48C486.71 498.83 476.49 513.17 466.27 527.51C467.92 534.44 479.28 547.49 483.75 553.95C497.79 574.23 511.99 594.4 526.21 614.54C530.87 621.14 535.5 627.76 540.09 634.42C541.74 636.81 543.8 641.24 546.45 642.56C550.67 644.65 557.47 643.1 562.11 643.1C573.09 643.09 584.12 642.98 595.11 643.14C599.11 643.19 604.17 644.06 607.98 643.07C607.91 639.18 603.07 634.19 600.71 630.97C594.57 622.58 588.74 613.94 582.8 605.41C562.42 576.17 541.86 547.08 521.46 517.87C516.28 510.44 511.03 503.05 505.87 495.6C503.33 491.93 500.85 486.7 496.93 484.48Z" fill="#fefefe" fillRule="evenodd" stroke="#fefefe" strokeWidth="0.25" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div onClick={goHome} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`navigation-icon ${active == ActivePage.HOME ? "active" : ""}`}>
                                <svg fill="#000000" width="800px" height="800px" fillRule="currentColor" viewBox="-2 3 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.469 12.594l3.625 3.313c0.438 0.406 0.313 0.719-0.281 0.719h-2.719v8.656c0 0.594-0.5 1.125-1.094 1.125h-4.719v-6.063c0-0.594-0.531-1.125-1.125-1.125h-2.969c-0.594 0-1.125 0.531-1.125 1.125v6.063h-4.719c-0.594 0-1.125-0.531-1.125-1.125v-8.656h-2.688c-0.594 0-0.719-0.313-0.281-0.719l10.594-9.625c0.438-0.406 1.188-0.406 1.656 0l2.406 2.156v-1.719c0-0.594 0.531-1.125 1.125-1.125h2.344c0.594 0 1.094 0.531 1.094 1.125v5.875z"></path>
                                </svg>
                            </div>
                            <span>Home</span>
                        </div>
                    </div>
                    <div onClick={goToExplore} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`navigation-icon ${active == ActivePage.SEARCH ? "active" : ""}`}>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g>
                                    <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path></g>
                                </svg>
                            </div>
                            <span>Explore</span>
                        </div>
                    </div>
                    <div onClick={goToNotifications} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`notifications navigation-icon ${active == ActivePage.NOTIFICATIONS ? "active" : ""}`}>
                                <NotificationsCount user={user} />
                                <svg viewBox="0 0 26 26" aria-hidden="true" fill="white"><g>
                                    <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path></g>
                                </svg>
                            </div>
                            <span>Notifications</span>
                        </div>
                    </div>
                    <div onClick={goToBookmarks} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`navigation-icon ${active == ActivePage.BOOKMARKS ? "active" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="-3 -2 21 21">
                                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                </svg>
                            </div>
                            <span>Bookmarks</span>
                        </div>
                    </div>
                    <div onClick={goToAllUsers} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`navigation-icon ${active == ActivePage.USERS ? "active" : ""}`}>
                                <svg viewBox="-1 0 27 27" aria-hidden="true"><g>
                                    <path d="M5.5 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18.25 13.91c-.18-2.01-.78-3.72-1.81-4.96C20.89 10.7 19.45 10 17.75 10c-.35 0-.68.03-1.01.09-.18.54-.45 1.05-.8 1.49.74.46 1.41 1.05 1.99 1.76 1.05 1.3 1.71 2.91 2.06 4.66h3.85l-.09-1.09zM18.5 9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM6.07 13.34c.58-.71 1.25-1.3 1.99-1.76-.35-.44-.62-.95-.8-1.49-.33-.06-.66-.09-1.01-.09-1.7 0-3.14.7-4.19 1.95C1.032 13.19.433 14.9.254 16.91L.157 18H4.01c.35-1.75 1.01-3.36 2.06-4.66zM15 8.5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-7.37 6.1c-1.07 1.32-1.69 3.15-1.88 5.31L5.66 21h12.68l-.09-1.09c-.19-2.16-.81-3.99-1.88-5.31-1.08-1.35-2.59-2.1-4.37-2.1s-3.28.75-4.37 2.1z"></path></g>
                                </svg>
                            </div>
                            <span>All users</span>
                        </div>
                    </div>
                    <div onClick={goToProfile} className="navigation-button">
                        <div className="navigation-button-inner">
                            <div className={`navigation-icon ${active == ActivePage.PROFILE ? "active" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                            </div>
                            <span>Profile</span>
                        </div>
                    </div>
                    <UserToast user={user} />
                </div>
            </header>
            <div className="master-pane">
                <div className="master-content">
                    <div className="content-wrapper">
                        <Outlet  key={count}/>
                        <ScrollRestoration />
                    </div>
                    <div className="right-pane" ref={wrapperRef}>
                        <div className="right-pane-content" ref={contentRef}>
                            {active != ActivePage.SEARCH && <SearchInput />}
                            {active == ActivePage.SEARCH && <SearchFilter />}
                            <TrendingPosts />
                            <WhoToFollow />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default MainPage;

