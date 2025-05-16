import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
// import Notes from "./pages/Notes";
// import Login from "./pages/Login";

// const notesOptions = [
//     { label: "Home", path: "/" },
//     { label: "Logout", path: "/login" },
// ];

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/notes" element={<Notes />} />
                <Route path="/login" element={<Login />} /> */}
            </Routes>
        </Router>
    );
};

export default App;