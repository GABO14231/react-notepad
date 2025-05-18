import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useState} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () =>
{
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={setUser} />} />
            </Routes>
        </Router>
    );
};


export default App;