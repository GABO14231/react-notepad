import {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/react.svg";

const Navbar = ({options}) =>
{
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() =>
    {
        let lastScrollY = window.scrollY;
        const handleScroll = () =>
        {
            if (window.scrollY > lastScrollY) setIsVisible(false);
            else setIsVisible(true);
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isVisible ? "visible" : "hidden"}`}>
            <div className="navbar-left">
                {isHome ? (<><img src={logo} alt="Logo" className="logo" /> <h1>React Notepad</h1></>) :
                    (<Link to="/" className="navbar-home-link"> <img src={logo} alt="Logo" className="logo" /> <h1>React Notepad</h1></Link>)}
            </div>
            <ul className="nav-links">
                {options.map((option, index) => (
                    <li key={index}>
                        <Link to={option.path || "#"} className="nav-link"
                            onClick={option.method ? option.method : undefined}> {option.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;