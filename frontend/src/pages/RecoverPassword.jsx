import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {recoverPassword} from "../components/ProfileManagement";
import Modal from "../components/Modal";
import "../styles/RecoverPassword.css";

const RecoverPassword = () =>
{
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [navigateAfterClose, setNavigateAfterClose] = useState(false);
    const navigate = useNavigate();

    const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    const handleRecovery = async (e) =>
    {
        e.preventDefault();

        try
        {
            const {ok, data} = await recoverPassword(code, newPassword, confirmPassword);
            if (ok)
            {
                console.log(`Server response: ${data.message}`);
                setMessage("Password recovered successfully!");
                setNavigateAfterClose(true);
            }
            else
            {
                console.log(`Server response: ${data.message}`);
                setMessage(data.message);
            }
        }
        catch (err)
        {
            console.error(err);
            setMessage("Password recovery failed.");
        }
    };

    return (
        <div className="recover-password-page">
            <h2>Recover Password</h2>
            <p>Please enter your recovery code and choose a new password.</p>
            <form onSubmit={handleRecovery}>
                <input id="recovery-code" type="text" placeholder="Enter your recovery code" value={code} onChange={(e) => setCode(e.target.value)} maxLength="6"/>
                <div className="password-wrapper">
                    <input type={showNewPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button type="button" onClick={toggleNewPasswordVisibility} className="toggle-password"> {showNewPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <div className="password-wrapper">
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="toggle-password"> {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <button className="submitButton" type="submit">Reset Password</button>
            </form>
            <button className="cancelButton" onClick={() => navigate('/login')}>Cancel</button>
            <Modal message={message} buttons={[{label: "Close", action: () =>
                {setMessage(""); if (navigateAfterClose) {setNavigateAfterClose(false); navigate("/login");}}}]} />
        </div>
    );
};

export default RecoverPassword;