import {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {NoteItem} from "../components/NoteItem";
import {NoteCard} from "../components/NoteCard";
import {getTags, addTags, getNotes, deleteTags} from "../components/NoteManagement";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../styles/Notes.css";

const Notes = ({user, onLogout}) =>
{
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState("");
    const [allTags, setAllTags] = useState({custom: [], builtIn: []});
    const [refresh, setRefresh] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() =>
    {
        const fetchNotes = async () =>
        {
            const result = await getNotes(user.id_user);
            if (result.ok && result.data?.notes)
            {
                const normalizedNotes = result.data.notes.map((note) =>
                ({
                    ...note,
                    id: note.id_note,
                    title: note.note_title,
                    content: note.note_content,
                    color: note.note_color,
                    tags: note.tags || [],
                }));
                setNotes(normalizedNotes);
            }
            else setNotes([]);
        };
        fetchNotes();
    }, [user, refresh]);

    useEffect(() =>
    {
        const fetchTags = async () =>
        {
            const result = await getTags(user.id_user);
            if (result.ok && result.data?.tags) setAllTags(result.data.tags);
            else setAllTags({ custom: [], builtIn: [] });
        };
        fetchTags();
    }, [user, refresh]);

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

    const toggleViewMode = useCallback(() => setViewMode((prev) => (prev === "list" ? "grid" : "list")), []);

    const handleLogout = () =>
    {
        console.log("Logging out...");
        onLogout();
    };

    const handleAddTag = async () =>
    {
        const newTag = prompt("Enter new tag name:");
        if (newTag && newTag.trim().length > 0)
        {
            const result = await addTags(user.id_user, newTag.trim());
            if (result.ok)
            {
                setAllTags((prev) => ({...prev, custom: [...prev.custom, result.data.tag]}));
                setRefresh((prev) => !prev);
                setMessage("Tag successfully added!");
            }
            else setMessage("Failed to add tag. Please try again.");
        }
    };
    const handleDeleteTag = async () =>
    {
        const tagName = prompt("Enter the custom tag name to delete:");
        if (!tagName || tagName.trim() === "") return;
        const trimmedName = tagName.trim();
        console.log(allTags.custom)
        const tagToDelete = allTags.custom.find((tag) => tag.utag_name.toLowerCase() === trimmedName.toLowerCase());
        console.log(tagToDelete)
        if (!tagToDelete)
        {
            setMessage(`Custom tag "${trimmedName}" not found.`);
            return;
        }
        const result = await deleteTags(tagToDelete.id_utags);
        if (result.ok)
        {
            setAllTags((prev) => ({...prev, custom: prev.custom.filter((tag) => tag.id !== tagToDelete.id_utags)}));
            setRefresh((prev) => !prev);
            setMessage(`Tag "${trimmedName}" deleted successfully!`);
        }
        else setMessage(`Failed to delete tag: ${result.data.message}`);
    };

    const handleDeleteNote = useCallback((noteId) => {setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId)); setRefresh((prev) => !prev);}, []);
    const notesOptions = [{label: "Home", path: "/"}, {label: "Settings", path: "/profile"}, {label: "Logout", method: handleLogout, path: "/"},];

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
                    <button onClick={handleAddTag}>Add Tag</button>
                    <button onClick={handleDeleteTag}>Delete Tag</button>
                </div>
            </header>
            <main className="notes-content">
                {viewMode === "list" ?
                (
                    <ul className="notes-list">
                            {notes.map((note) => (<NoteItem key={note.id} note={note} onClick={() => openNote(note.id)} onDelete={handleDeleteNote} />))}
                    </ul>
                ):
                (
                    <div className="notes-grid">
                            {notes.map((note) => (<NoteCard key={note.id} note={note} onClick={() => openNote(note.id)} onDelete={handleDeleteNote} />))}
                    </div>
                )}
            </main>
            <Modal message={message} buttons={[{label: "Close", action: () => setMessage("")}]} />
        </div>
    );
};

export default Notes;