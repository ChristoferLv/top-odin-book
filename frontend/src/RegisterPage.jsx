import { useContext, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router";
import { getMe, login, register } from "../api/requests";

function RegisterPage() {
    const [userData, setUserData] = useState({ username: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ username: false, password: false, picture: false });
    const [conflictError, setConflictError] = useState(false);
    const usernameRegex = /^[a-zA-Z0-9\s\-.]+$/;

    const fileInputRef = useRef(null);
    const [picture, setPicture] = useState(null);

    function handleClickImage(e) {
        fileInputRef.current.click();
    }

    async function handleUploadImage(e) {
        if (e.target.files[0].size > 5000000) {
            setErrors({ ...errors, picture: true });
            fileInputRef.current.value = "";
            return;
        }
        setPicture(e.target.files[0])
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

    async function handdleSubmit(e) {
        e.preventDefault();
        if (!isAllValid()) return;
        if (!isValuesValid()) return;

        const formData = new FormData();
        formData.append("username", userData.username);
        formData.append("password", userData.password);
        formData.append("confirmPassword", userData.confirmPassword);
        formData.append("picture", picture);

        const rawResponse = await register(formData);

        setConflictError(false);
        if (rawResponse.status == 409) {
            setConflictError(true);
        }

        if (rawResponse.ok) {
            navigate("/login", { replace: true });
        } else {
            alert("Something went wrong, try again later.");
        }
    }

    let objURL;
    if (picture)
        objURL = URL.createObjectURL(picture);

    return (<>
        <div className="auth-container">
            <form onSubmit={handdleSubmit} className="auth-form">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    name="picture"
                    style={{ display: "none" }}
                    onChange={handleUploadImage}
                />
                <h1>Register</h1>
                <div
                    className="profile-pic" onClick={handleClickImage}
                >
                    <img src={!picture ? "../public/avatar.png" :
                        objURL} alt="" />
                </div>
                {errors.picture &&  <p className="error">Maximum picture file size is 5MB.</p>}

                <label htmlFor="username">
                    Username:
                </label>
                <input type="text"
                    id="username"
                    name="username"
                    placeholder="Enter a Username"
                    required
                    minLength={3}
                    maxLength={30}
                    onChange={handleUserData} />
                {errors.username && <p className="error align-left">Username can only contain letters, numbers, space, - and .</p>}

                <label htmlFor="password">
                    Password:
                </label>
                <input type="password"
                    id="password"
                    name="password"
                    placeholder="Enter a Password"
                    required
                    minLength={3}
                    maxLength={50}
                    onChange={handleUserData} />
                {errors.password && <p className="error align-left">Password fields does not match.</p>}


                <label htmlFor="confirmPassword">
                    Password Confirmation:
                </label>
                <input type="password"
                    id="password"
                    name="confirmPassword"
                    placeholder="Enter your Password Again"
                    required
                    minLength={3}
                    maxLength={50}
                    onChange={handleUserData} />



                <div className="wrap">
                    <button type="submit">
                        Submit
                    </button>
                </div>
                <p>Already have an account? &nbsp;
                    <Link to={"/login"} className="link-plain">
                        Log in
                    </Link>
                </p>
            </form >
        </div >
    </>)
}



export default RegisterPage;