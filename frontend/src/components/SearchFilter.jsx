import { useState } from "react";
import { useSearchParams } from "react-router";

function SearchFilter() {
    const [followingFilter, setFollowingFilter] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    function handleOptionChange() {
        const newValue = !followingFilter;

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
                <div>
                    <label htmlFor="apple">
                        <input
                            type="radio"
                            checked={!followingFilter}
                            onChange={handleOptionChange}
                        />
                        Any user
                    </label>
                </div>

                <div>
                    <label htmlFor="banana">
                        <input
                            type="radio"
                            checked={followingFilter}
                            onChange={handleOptionChange}
                        />
                        Users thet you follow
                    </label>
                </div>
            </div>
        </>
    );
}



export default SearchFilter;