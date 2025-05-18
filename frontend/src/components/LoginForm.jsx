import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import Modal from "./Modal";
import "../styles/LoginForm.css";

const LoginForm = ({onLogin, redirectPage}) =>
{
    const [input, setInput] = useState({identifier: "", password: ""});
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateInput = () =>
    {
        const {identifier, password} = input;
        if (!identifier || !password) return "Both fields are required.";
        const isEmail = identifier.includes(".") || identifier.includes("@");

        if (isEmail)
        {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
            if (!identifier.includes("@")) return "Email must contain '@'.";
            if (!emailRegex.test(identifier)) return "Invalid email format (check domain part).";
        }
        else
        {
            const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
            if (identifier.length < 3) return "Username must be at least 3 characters.";
            if (!usernameRegex.test(identifier)) return "Username can only contain letters, numbers, and underscores.";
        }

        if (password.length < 6) return "Password must be at least 6 characters.";

        return "";
    };         

    const handleChange = (e) => {setInput({...input, [e.target.name]: e.target.value});};
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const validationError = validateInput();

        if (validationError)
        {
            setError(validationError);
            return;
        }

        if (input.identifier === "testuser" && input.password === "password123")
        {
            onLogin({username: "testuser", email: "test@example.com"});
            navigate(redirectPage);
        }
        else setError("Invalid login credentials.");
    };
    
    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="identifier" placeholder="Username or Email"
                    value={input.identifier} onChange={handleChange}/>
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="password"
                        placeholder="Password" value={input.password} onChange={handleChange}/>
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
            <Modal message={error} buttons={[{label: "Close", action: () => setError("")}]} />
            <div className="login-links">
                <Link to="/">Back to Home</Link> | <Link to="/register">Register</Link>
            </div>
        </div>
    );
};

export default LoginForm;