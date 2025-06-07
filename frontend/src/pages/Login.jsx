import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {loginUser} from "../components/ProfileManagement";
import Modal from "../components/Modal";
import "../styles/Login.css";

const Login = ({onLogin}) =>
{
    const [input, setInput] = useState({identifier: "", password: ""});
    const [message, setMessage] = useState("");
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
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const validationError = validateInput();
        if (validationError)
        {
            setMessage(validationError);
            return;
        }
        try
        {
            const {ok, data} = await loginUser(input);
            if (ok)
            {
                onLogin(data.user);
                console.log(`Server response: ${data.message}`);
                navigate("/notes");
            }
            else
            {
                console.log(`Server response: ${data.message}`);
                setMessage(data.message || "Invalid login credentials.");
            }
        }
        catch (err)
        {
            console.error(err);
            setMessage("An error occurred during login.");
        }
    };
    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="identifier" placeholder="Username or Email"
                    value={input.identifier} onChange={handleChange} />
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="password"
                        placeholder="Password" value={input.password} onChange={handleChange} />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
            <Modal message={message} buttons={[{label: "Close", action: () => setMessage("")}]} />
            <div className="login-links">
                <Link to="/">Back to Home</Link> | <Link to="/register">Register</Link> | <Link to="/recoverpass">Forgot Password?</Link>
            </div>
        </div>
    );
};

export default Login;