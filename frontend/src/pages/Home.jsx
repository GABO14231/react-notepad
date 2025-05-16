import Navbar from "../components/Navbar";
import "../styles/Home.css"
import logo from "../assets/vite.svg"

const homeOptions = [{ label: "Login", path: "/login" }, { label: "Register", path: "/register" }];

const Home = () =>
{
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