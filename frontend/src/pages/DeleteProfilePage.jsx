import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {deleteProfile} from "../components/ProfileManagement";
import Modal from "../components/Modal";
import "../styles/DeleteProfilePage.css"

const DeleteProfilePage = ({user}) =>
{
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    if (!user || !user.id_user)
    {
        setError("User data missing. Please log in again.");
        return;
    }

    const handleDelete = async (e) =>
    {
        e.preventDefault();
        try
        {
            const {ok, data} = await deleteProfile(password, user.id_user);
            if (ok)
            {
                console.log(`Server response: ${data.message}`);
                setError("Profile deleted successfully");
                navigate("/register");
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
            setError("Profile deletion failed");
        }
    };

    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

    return (
        <div className="delete-profile-page">
            <h2>Delete Profile</h2>
            <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
            <form onSubmit={handleDelete}>
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password to confirm" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password"> {showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <Modal message={error} buttons={[{label: "Close", action: () => setError("")}]} />
                <button className="deleteButton" type="submit">Confirm Delete</button>
            </form>
            <button className="cancelButton" onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
};

export default DeleteProfilePage;