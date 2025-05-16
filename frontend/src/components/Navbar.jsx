import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/react.svg";

const Navbar = ({ options }) =>
{
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
                <img src={logo} alt="Logo" className="logo" />
                <h1>React Notepad</h1>
            </div>
            <button className="menu-toggle">☰</button>
            <ul className="nav-links">
                {options.map((option, index) => (
                    <li key={index}><Link to={option.path}>{option.label}</Link></li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;