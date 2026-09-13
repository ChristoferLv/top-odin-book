import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

function SearchFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [followingFilter, setFollowingFilter] = useState(searchParams.get("pf") && searchParams.get("pf") == "on");


   

    function handleOptionChange(followers) {
        if (followingFilter == followers) return;
        const newValue = followers;

        if (newValue == true) {
            const paramsObj = Object.fromEntries([...searchParams]);
            setSearchParams({ ...paramsObj, pf: "on" })
        } else {
            const paramsObj = Object.fromEntries([...searchParams]);
            const { pf, ...rest } = paramsObj;
            setSearchParams(rest);
        }

        setFollowingFilter(newValue);
    }

    return (
        <>
            <div className="search-filters-title">
                <p>Search Filters</p>
            </div>

            <div className="search-filters-select">
                <p>Users</p>
                <label className="container">
                    <p>Any user</p>
                    <span className="checkmark">
                        <div className={`marker ${!followingFilter ? "checked" : ""}`}>
                            <svg viewBox="-2 -2 28 28" aria-hidden="true"><g>
                                <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g>
                            </svg>
                        </div>
                        <input type="radio"
                            checked={!followingFilter}
                            onChange={(e) => handleOptionChange(false)}></input>
                    </span>
                </label>
                <label className="container">
                    <p>Users that you follow</p>
                    <span className="checkmark">
                        <div className={`marker ${followingFilter ? "checked" : ""}`}>
                            <svg viewBox="-2 -2 28 28" aria-hidden="true"><g>
                                <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g>
                            </svg>
                        </div>
                        <input type="radio"
                            checked={followingFilter}
                            onChange={(e) => handleOptionChange(true)}></input>
                    </span>
                </label>
            </div>
        </>
    );
}



export default SearchFilter;