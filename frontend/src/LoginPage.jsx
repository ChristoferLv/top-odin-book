import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router";
import { getMe, login } from "../api/requests";

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorVisible, setErrorVisible] = useState(false);

    function isAllValid() {
        const inputs = document.querySelectorAll("input");
        const allValid = Array.from(inputs).every((input) => input.reportValidity());
        return allValid;
    }

    /**
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
    function handlePersonalInfo(event) {
        const whoChanged = event.target;
        setCredentials({ ...credentials, [whoChanged.name]: whoChanged.value });
    }

    async function handdleSubmit(e) {
        e.preventDefault();
        if (!isAllValid) return;
        const rawResponse = await login(credentials);

        setErrorVisible(false);
        if (rawResponse.status == 401) {
            setErrorVisible(true);
        }

        if (rawResponse.status == 200) {
            const content = await rawResponse.json();
            localStorage.setItem("token", content.token);
        } else {
            alert("Something went wrong, try again later.");
        }

        const meResult = await getMe();
        if (!meResult) {
            alert("Something went wrong, try again later.");
        }
        localStorage.setItem("user", JSON.stringify(meResult.data));
        setUser(meResult.data);
        navigate("/", { replace: true });
    }



    return (<>
        <div className="auth-container">
            <form onSubmit={handdleSubmit} className="auth-form">
                <h1>Log in</h1>
                <label htmlFor="username">
                    Username:
                </label>
                <input type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your Username"
                    onChange={handlePersonalInfo}
                    required />

                <label htmlFor="password">
                    Password:
                </label>
                <input type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your Password"
                    onChange={handlePersonalInfo}
                    required />

                {errorVisible && <p className="login-error">Wrong credentials.</p>}

                <div className="wrap">
                    <button type="submit">
                        Submit
                    </button>
                </div>
                <p>Not registered? &nbsp;
                    <Link to={"/register"} className="link-plain">
                        Create an account
                    </Link>
                </p>
            </form >
        </div >
    </>)
}



export default LoginPage;