import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const Dashboard = ({user, onLogout}) =>
{
    const handleLogout = () =>
    {
        console.log("Logging out...");
        onLogout();
    };

    const dashboardOptions = [{label: "Home", path: "/"}, {label: "Logout", method: handleLogout, path: "/"}, {label: "Settings", path: "/profile"}];

    return (
        <div className="dashboard-container">
            <Navbar options={dashboardOptions} />
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Dashboard;