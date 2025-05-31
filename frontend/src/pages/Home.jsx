import Navbar from "../components/Navbar";
import "../styles/Home.css"
import logo from "../assets/vite.svg"

const Home = ({user, onLogout}) =>
{
    const handleLogout = () =>
    {
        console.log("Logging out...");
        onLogout();
    };

    let homeOptions = [];
    if (user) homeOptions = [{label: "Dashboard", path: "/dashboard"}, {label: "Settings", path: "/profile"}, {label: "Logout", method: handleLogout, path: "/"}];
    else homeOptions = [{label: "Login", path: "/login"}, {label: "Register", path: "/register"}];

    return (
        <div>
            <Navbar options={homeOptions} />
            <header className="home">
                <h1>Welcome to React Notepad</h1>
                <p>Your personal space for jotting down ideas and notes.</p>
                <img src={logo} alt="Logo" className="logoVite" />
                <p style={{fontSize: "25px"}}>Made using React and Vite.</p>
                <p>Project by Gabriel Morazan</p>
            </header>
        </div>
    );
};

export default Home;