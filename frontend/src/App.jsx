import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useState, useEffect} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DeleteProfilePage from "./pages/DeleteProfilePage";
import Dashboard from "./pages/Dashboard";

const App = () =>
{
    const [user, setUser] = useState(() =>
    {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() =>
    {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home user={user} onLogout={() => setUser(null)} />} />
                <Route path="/login" element={user ? (<Dashboard user={user} onLogout={() => setUser(null)} />) : (<Login onLogin={setUser} redirectPage={"/dashboard"} />)} />
                <Route path="/register" element={user ? (<Dashboard user={user} onLogout={() => setUser(null)} />) : (<Register onRegister={setUser} redirectPage={"/dashboard"} />)} />
                <Route path="/profile" element={user ? (<Profile profileData={user} setProfileData={setUser} onLogout={() => setUser(null)} />) : (<Login onLogin={setUser} />)} />
                <Route path="/delprofile" element={user ? (<DeleteProfilePage user={user} onDelete={() => setUser(null)} />) : (<Login onLogin={setUser} />)} />
                <Route path="/dashboard" element={user ? (<Dashboard user={user} onLogout={() => setUser(null)} />) : (<Login onLogin={setUser} />)} />
            </Routes>
        </Router>
    );
};

export default App;