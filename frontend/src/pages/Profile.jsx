import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {loadProfile, updateCode} from "../components/ProfileManagement";
import Modal from "../components/Modal";
import "../styles/Profile.css";
import Navbar from "../components/Navbar";

const Profile = ({profileData, setProfileData, onLogout}) =>
{
    const [form, setForm] = useState({username: "", email: "", first_name: "", last_name: "", code: "", currentPassword: "", newPassword: "", confirmPassword: ""});
    const [message, setMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState({currentPassword: false, newPassword: false, confirmPassword: false, backupCode: false});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalConfig, setConfirmModalConfig] = useState({message: "", buttons: []});
    const navigate = useNavigate();

    useEffect(() =>
    {
        setForm({username: profileData.username, email: profileData.email,
            first_name: profileData.first_name, last_name: profileData.last_name,
            code: profileData.code, currentPassword: "", newPassword: "", confirmPassword: ""});
    }, [profileData]);

    const validateInput = () =>
    {
        const {username, email, currentPassword, newPassword, confirmPassword} = form;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!email.includes("@")) return "Email must contain '@'.";
        if (!emailRegex.test(email)) return "Invalid email format (check domain part).";

        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (username.length < 3) return "Username must be at least 3 characters.";
        if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, and underscores.";
        if ((currentPassword !== "") || (newPassword !== "") || (confirmPassword !== ""))
        {
            if (((currentPassword === "") && (confirmPassword !== "")) || ((currentPassword === "") && (newPassword !== ""))) return "Please insert your current password."
            if (((newPassword !== "") && (confirmPassword === "")) || ((confirmPassword !== "") && (newPassword === ""))) return "Please enter your new password twice."
            if ((currentPassword.length < 6) || (newPassword.length < 6) || (confirmPassword.length < 6)) return "Password must be at least 6 characters.";
            if (newPassword !== confirmPassword) return "The passwords do not match."
            if ((newPassword === confirmPassword) && (confirmPassword === currentPassword)) return "You are using your current password. Please use a new one."
        }

        return "";
    };

    const handleChange = (e) => {setForm(prev => ({...prev, [e.target.name]: e.target.value}));};
    const handleUpdate = async () =>
    {
        const validationError = validateInput();
        if (validationError)
        {
            setMessage(validationError);
            return;
        }
        try
        {
            const {ok, data} = await loadProfile(form, profileData);
            if (ok)
            {
                setProfileData(data.user);
                console.log(`Server response: ${data.message}`);
                setMessage("Profile updated successfully!");
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
            setMessage("Profile update failed");
        }
    };

    const handleCode = async () =>
    {
        try
        {
            const {ok, data} = await updateCode(profileData.id_user);
            if (ok)
            {
                setProfileData(data.user);
                console.log(`Server response: ${data.message}`);
                setMessage("Code updated successfully!");
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
            setMessage("Profile update failed");
        }
    }

    const confirmUpdate = () =>
    {
        setConfirmModalConfig({
            message: "Are you sure you want to update your profile?",
            buttons: [{label: "Yes, change it", action: () => {handleUpdate(); setShowConfirmModal(false);}},
            {label: "Cancel", action: () => setShowConfirmModal(false)}]
        });
        setShowConfirmModal(true);        
    }

    const confirmChangeCode = () =>
    {
        setConfirmModalConfig({
            message: "Are you sure you want to change your recovery code?",
            buttons: [{label: "Yes, change it", action: () => {handleCode(); setShowConfirmModal(false);}},
                {label: "Cancel", action: () => setShowConfirmModal(false)}]});
        setShowConfirmModal(true);
    };

    const confirmDeleteProfile = () =>
    {
        setConfirmModalConfig({
            message: "Are you sure you want to delete your profile?",
            buttons: [{label: "Yes, delete", action: () => {handleDeleteNavigation(); setShowConfirmModal(false);}},
                {label: "Cancel", action: () => setShowConfirmModal(false)}]
        });
        setShowConfirmModal(true);
    };

    const handleDeleteNavigation = () => {navigate(`/delprofile`);};
    const togglePasswordVisibility = (field) => {setPasswordVisibility((prev) => ({...prev, [field]: !prev[field]}));};
    const handleLogout = () =>
    {
        console.log("Logging out...");
        onLogout();
    };

    return (
        <div className="profile-page">
            <Navbar options={[{label: "Go Back", path: "/notes" }, {label: "Logout", method: handleLogout, path: "/"}]} />
            <h2>Update Profile</h2>
            <form>
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
                <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
                <h2>Change Password</h2>
                <div className="password-wrapper">
                    <input type={passwordVisibility.currentPassword ? "text" : "password"} name="currentPassword" placeholder="Current Password" value={form.currentPassword} onChange={handleChange} />
                    <button type="button" onClick={() => togglePasswordVisibility("currentPassword")} className="toggle-password"> {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <div className="password-wrapper">
                    <input type={passwordVisibility.newPassword ? "text" : "password"} name="newPassword" placeholder="New Password" value={form.newPassword} onChange={handleChange} />
                    <button type="button" onClick={() => togglePasswordVisibility("newPassword")} className="toggle-password"> {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <div className="password-wrapper">
                    <input type={passwordVisibility.confirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm New Password" value={form.confirmPassword} onChange={handleChange} />
                    <button type="button" onClick={() => togglePasswordVisibility("confirmPassword")} className="toggle-password"> {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                <button className="submitButton" type="button" onClick={confirmUpdate}>Update Profile</button>
            </form>
            <hr />
            <h2>Backup Code</h2>
            <input style={{textAlign: "center"}} type={passwordVisibility.backupCode ? "text" : "password"} readOnly={true} value={form.code} />
            <button style={{width: "100%"}} className="backupButton" onClick={() => togglePasswordVisibility("backupCode")}>Show Backup Code</button>
            <button style={{width: "100%"}} className="backupButton" onClick={confirmChangeCode}>Change Backup Code</button>
            <hr />
            <button className="deleteButton" onClick={confirmDeleteProfile}>Delete Profile</button>
            {showConfirmModal && (<Modal message={confirmModalConfig.message} buttons={confirmModalConfig.buttons}/>)}
            {message && (<Modal message={message} buttons={[{label: "Close", action: () => setMessage("")}]} />)}
        </div>
    );
};

export default Profile;