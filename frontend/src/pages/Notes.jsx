import {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {NoteItem} from "../components/NoteItem";
import {NoteCard} from "../components/NoteCard"
import Navbar from "../components/Navbar";
import "../styles/Notes.css";

const Notes = ({user, onLogout}) =>
{
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const dummyNotes = [
            {
                id: 1,
                title: "First Note",
                content:
                    "This is the content of the first note. It might be long, but we show a snippet in the dashboard.",
                color: "#f0f0f0",
                tags: ["Personal"],
            },
            {
                id: 2,
                title: "Second Note",
                content:
                    "Content for the second note goes here. It can include more details and is marked as important.",
                color: "#e0e0e0",
                tags: ["Work", "Important"],
            },
            {
                id: 3,
                title: "Third Note",
                content:
                    "Third note’s content goes here. It is a sample note for demonstration purposes.",
                color: "#d0d0d0",
                tags: [],
            },
        ];
        setNotes(dummyNotes);
    }, []);

    const openNote = useCallback((noteId) =>
    {
        const popoutUrl = `${window.location.origin}/notes/${noteId}?popout=true`;
        if (window.popOutEditor && !window.popOutEditor.closed)
        {
            window.popOutEditor.location.href = popoutUrl;
            return;
        }
        navigate(`/notes/${noteId}`);
    }, [navigate]);

    const handleAddNote = useCallback(() =>
    {
        const url = `${window.location.origin}/notes/new?popout=true`;
        if (window.popOutEditor && !window.popOutEditor.closed)
        {
            window.popOutEditor.location.href = url;
            return;
        }
        navigate("/notes/new");
    }, [navigate]);

    const toggleViewMode = useCallback(() => {setViewMode((prev) => (prev === "list" ? "grid" : "list"));}, []);

    const handleLogout = () =>
    {
        console.log("Logging out...");
        onLogout();
    };
    const notesOptions = [{label: "Home", path: "/"}, {label: "Settings", path: "/profile"}, {label: "Logout", method: handleLogout, path: "/"}];

    return (
        <div className="notes-dashboard">
            <Navbar options={notesOptions} />
            <header className="dashboard-header">
                <h1>My Notes</h1>
                <div className="actions">
                    <button onClick={toggleViewMode} aria-pressed={viewMode === "grid"}>
                        {viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
                    </button>
                    <button onClick={handleAddNote}>Add Note</button>
                </div>
            </header>
            <main className="notes-content">
                {viewMode === "list" ?
                (
                    <ul className="notes-list">
                        {notes.map((note) => (<NoteItem key={note.id} note={note} onClick={openNote} />))}
                    </ul>
                ):
                (
                    <div className="notes-grid">
                        {notes.map((note) => (<NoteCard key={note.id} note={note} onClick={openNote} />))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Notes;