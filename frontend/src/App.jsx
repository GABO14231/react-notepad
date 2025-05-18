import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useState} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () =>
{
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={setUser} />} />
                <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Login onLogin={setUser} />} />
            </Routes>
        </Router>
    );
};

export default App;