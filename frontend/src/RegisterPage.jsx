import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../api/requests";

function RegisterPage() {
    const [userData, setUserData] = useState({ name: '', username: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ username: false, password: false, picture: false });
    const [conflictError, setConflictError] = useState(false);
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    const fileInputRef = useRef(null);
    const [picture, setPicture] = useState(null);
    const [imgUrl, setImgUrl] = useState("");

    function handleClickImage(e) {
        fileInputRef.current.click();
    }

    async function handleUploadImage(e) {
        setErrors({ ...errors, picture: false });
        if (e.target.files[0].size > 5000000) {
            setErrors({ ...errors, picture: true });
            fileInputRef.current.value = "";
            setImgUrl("");
            return;
        }
        setPicture(e.target.files[0]);
        setImgUrl(URL.createObjectURL(e.target.files[0]));
    }

    function isAllValid() {
        const inputs = document.querySelectorAll("input");
        const allValid = Array.from(inputs).every((input) => input.reportValidity());
        return allValid;
    }

    function isValuesValid() {
        const newErrors = { username: false, password: false, picture: errors.picture };
        let valid = true;

        const usernameValid = userData.username.match(usernameRegex);
        if (!usernameValid) {
            newErrors.username = true;
            valid = false;
        }

        if (userData.password != userData.confirmPassword) {
            newErrors.password = true;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    function handleUserData(event) {
        const whoChanged = event.target;
        setUserData({ ...userData, [whoChanged.name]: whoChanged.value });
    }

    function removeImg(e) {
        e.stopPropagation();
        setPicture(null);
        setImgUrl("");
    }

    async function handdleSubmit(e) {
        e.preventDefault();
        if (!isAllValid()) return;
        if (!isValuesValid()) return;

        const formData = new FormData();
        formData.append("username", userData.username);
        formData.append("name", userData.name);
        formData.append("password", userData.password);
        formData.append("confirmPassword", userData.confirmPassword);
        formData.append("picture", picture);

        const rawResponse = await register(formData);

        setConflictError(false);
        if (rawResponse.status == 409) {
            setConflictError(true);
            return;
        }

        if (rawResponse.ok) {
            navigate("/login", { replace: true });
        } else {
            alert("Something went wrong, try again later.");
        }
    }

    return (<>
        <div className="login-page">
            <form onSubmit={handdleSubmit} className="auth-form">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    name="picture"
                    style={{ display: "none" }}
                    onChange={handleUploadImage}
                />
                <p className="page-title register">Register</p>
                <div className="picture-space">
                    <div
                        className="profile-pic" onClick={handleClickImage}
                    >
                        <img src={imgUrl == "" ? "../public/avatar.png" :
                            imgUrl} alt="" />
                    </div>
                   {imgUrl != "" && <button title="Remove image" type="button" className='close-button' onClick={removeImg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="white" />
                        </svg>
                    </button>}
                </div>
                {errors.picture && <p className="error">Maximum picture file size is 5MB.</p>}
                <div className="user-data-inputs register">
                    <div className={`user-field`}>
                        <input name="username" type="text" id="username" placeholder=" " required value={userData.username} onChange={handleUserData} />
                        <div className="field-infos">
                            <label htmlFor="username">Username (can not be changed)</label>
                        </div>
                    </div>
                    {errors.username && <p className="error align-left">Username can only contain letters, numbers and _</p>}
                    {conflictError && <p className="error align-left">Username is already used</p>}

                    <div className={`user-field`}>
                        <input name="name" type="text" id="name" placeholder=" " required value={userData.name} onChange={handleUserData} />
                        <div className="field-infos">
                            <label htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className={`user-field`}>
                        <input name="password" type="password" id="password" placeholder=" " required value={userData.password} onChange={handleUserData} />
                        <div className="field-infos">
                            <label htmlFor="name">Password</label>
                        </div>
                    </div>
                    {errors.password && <p className="error align-left">Password fields does not match.</p>}

                    <div className={`user-field`}>
                        <input name="confirmPassword" type="password" id="confirmPassword" placeholder=" " required value={userData.confirmPassword} onChange={handleUserData} />
                        <div className="field-infos">
                            <label htmlFor="name">ConfirmPassword</label>
                        </div>
                    </div>
                </div>

                <input className="register" type="submit" value={"Continue"} />

                <p className="link">Already have an account? &nbsp;
                    <Link to={"/login"} className="link">
                        Log in
                    </Link>
                </p>
            </form>

            <div className="logo-side">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="150 150 600 600" transform="matrix(-1,0,0,1,0,0)">
                    <path d="M442.21 336.89C445.57 334.1 447.75 329.48 450.24 325.9C455.83 317.86 461.58 309.89 467.25 301.89C483.61 278.81 499.84 255.58 516.04 232.36C521.99 223.83 527.89 215.26 533.92 206.79C535.71 204.29 538.03 198.98 540.67 197.41C543.4 195.8 549.29 196.79 552.48 196.88C561.86 197.17 571.24 196.79 580.62 196.93C606.3 197.31 632.2 197.53 657.88 196.97C666.81 196.78 689.26 195.33 697 197.56C693.24 204.06 688.4 210.03 684.13 216.2C674.82 229.67 665.27 242.96 655.95 256.42C627 298.21 597.36 339.54 568.52 381.41C557.15 397.91 545.44 414.18 534.05 430.67C531.83 433.87 521.7 446.6 521.56 449.47C521.4 452.94 529.6 462.5 531.81 465.69C542.34 480.88 553.19 495.86 563.63 511.11C590.93 551 619.17 590.26 646.76 629.95C655.45 642.45 664.27 654.86 672.96 667.36C676.66 672.68 681.1 677.91 684.11 683.63C678.76 685.48 671.59 684.45 665.84 684.38C654.88 684.24 643.9 684.47 632.94 684.34C608.52 684.06 584.1 684.73 559.68 684.34C549.27 684.18 538.69 685.17 528.31 684.37C491.81 632.62 455.3 580.87 418.79 529.12C486.23 432.28 553.68 335.44 621.12 238.61C616.98 237.28 611.6 238.12 607.18 238.16C596.45 238.25 585.71 238.19 574.99 238.21C570.52 238.22 562.76 236.47 558.85 238.97C555.61 241.03 545.98 256.84 543.06 261C531.55 277.37 519.99 293.71 508.58 310.17C480.16 351.15 451.28 391.85 422.68 432.74C410.98 449.48 398.59 465.88 387.48 483.02C383.34 481.11 374.81 466.37 371.49 461.77C357.96 443.02 345.33 423.62 332.13 404.59C284.16 335.45 235.7 266.48 187.28 197.56C191.18 194.64 199.88 196.38 204.81 196.3C219.81 196.09 234.87 196.62 249.87 196.35C272.89 195.95 296.07 195.99 319.08 196.43C324.12 196.52 339.19 194.94 343.01 196.62C345.79 197.84 348.46 203.8 350.18 206.28C355.89 214.51 361.64 222.72 367.43 230.9C384.66 255.28 401.73 279.77 418.81 304.25C423.99 311.68 429.18 319.1 434.39 326.5C436.77 329.87 438.98 334.36 442.21 336.89ZM325.52 237.96C320.83 236.44 315.15 237.61 310.23 237.49C299.37 237.22 288.1 236.85 277.23 237.47C273.08 237.71 266.56 235.96 263.23 238.61C265.43 243.53 269.44 248.09 272.58 252.49C279.29 261.89 285.97 271.34 292.5 280.87C311.66 308.84 331.77 336.17 350.85 364.21C358.64 375.66 366.9 386.79 374.69 398.25C377.88 402.94 382.9 412.28 387.48 415.11C391.51 411.59 394.24 406.08 397.24 401.66C401.66 395.14 406.45 388.86 410.85 382.3C412.71 379.51 417.77 374.82 417.77 371.39C417.76 367.73 413.15 363.07 411.14 360.23C405.14 351.74 399.06 343.28 393.19 334.7C370.95 302.23 347.35 270.66 325.52 237.96ZM496.93 484.48C486.71 498.83 476.49 513.17 466.27 527.51C467.92 534.44 479.28 547.49 483.75 553.95C497.79 574.23 511.99 594.4 526.21 614.54C530.87 621.14 535.5 627.76 540.09 634.42C541.74 636.81 543.8 641.24 546.45 642.56C550.67 644.65 557.47 643.1 562.11 643.1C573.09 643.09 584.12 642.98 595.11 643.14C599.11 643.19 604.17 644.06 607.98 643.07C607.91 639.18 603.07 634.19 600.71 630.97C594.57 622.58 588.74 613.94 582.8 605.41C562.42 576.17 541.86 547.08 521.46 517.87C516.28 510.44 511.03 503.05 505.87 495.6C503.33 491.93 500.85 486.7 496.93 484.48Z" fill="#fefefe" fillRule="evenodd" stroke="#fefefe" strokeWidth="0.25" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    </>)
}



export default RegisterPage;