import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {registerUser} from "../components/ProfileManagement";
import Modal from "../components/Modal";
import "../styles/Register.css"

const Register = ({onRegister, redirectPage}) =>
{
    const [input, setInput] = useState({username: "", email: "", password: "", first_name: "", last_name: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateInput = () =>
    {
        const {username, email, password, first_name, last_name} = input;
        if (!username || !email || !password || !first_name || !last_name) return "All fields are required.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!email.includes("@")) return "Email must contain '@'.";
        if (!emailRegex.test(email)) return "Invalid email format (check domain part).";

        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (username.length < 3) return "Username must be at least 3 characters.";
        if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, and underscores.";
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
            setError(validationError);
            return;
        }
        try
        {
            const {ok, data} = await registerUser(input);
            // if (ok) navigate(`/profile/${data.user.id_user}`);
            if (ok)
            {
                onRegister(data.user);
                console.log(`Server response:  ${data.message}`);
                if (redirectPage) navigate(redirectPage);
            }
            else
            {
                console.log(`Server response: ${data.message}`);
                setError(data.message);
            }
        }
        catch (err)
        {
            console.error(err);
            setError("Registration failed");
        }
    };

    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={input.username} onChange={handleChange}/>
                <input name="email" placeholder="Email" value={input.email} onChange={handleChange}/>
                <input name="first_name" placeholder="First Name" value={input.first_name} onChange={handleChange}/>
                <input name="last_name" placeholder="Last Name" value={input.last_name} onChange={handleChange}/>
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="password"
                        placeholder="Password" value={input.password} onChange={handleChange} />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button type="submit" className="submitButton">Register</button>
            </form>
            <Modal message={error} buttons={[{label: "Close", action: () => setError("")}]} />
            <div className="login-links">
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default Register;