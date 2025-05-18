import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = ({user, onLogout}) =>
{
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        onLogout(); // Clears user data
        navigate("/"); // Redirects back to Home
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default Dashboard;