import {memo, useState} from "react";
import {FaTrash} from "react-icons/fa";
import {deleteNotes} from "./NoteManagement";
import Modal from "../components/Modal";

const createSnippet = (content, length) =>
{
    if (!content) return "";
    return content.length > length ? content.substring(0, length) + "..." : content;
};

export const NoteItem = memo(({note, onClick, onDelete}) =>
{
    const [message, setMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalConfig, setConfirmModalConfig] = useState({message: "", buttons: []});

    const handleDelete = async () =>
    {
        try
        {
            const result = await deleteNotes(note.id);
            if (result.ok)
            {
                onDelete(note.id);
                setMessage("Note deleted successfully!");
            }
            else setMessage("Failed to delete note: " + result.data.message);
        }
        catch (error)
        {
            console.error("Error deleting note:", error);
            setMessage("An unexpected error occurred while deleting the note.");
        }
    };

    const confirmDeleteNote = () =>
    {
        setConfirmModalConfig({
            message: `Are you sure you want to delete "${note.title}"?`,
            buttons: [{label: "Yes", action: () => {handleDelete(); setShowConfirmModal(false);}},
            {label: "Cancel", action: () => setShowConfirmModal(false)}]
        });
        setShowConfirmModal(true);
    };

    return (
        <li className="note-item" style={{backgroundColor: note.color}} onClick={() => onClick(note.id)}
            role="button" tabIndex={0} onKeyDown={(e) => {if (e.key === "Enter") onClick(note.id);}}>
            <div className="note-header">
                <h2>{note.title}</h2>
                <button className="delete-button" onClick={(e) => {e.stopPropagation(); confirmDeleteNote();}}><FaTrash /></button>
            </div>
            <p>{createSnippet(note.content, 100)}</p>
            {note.tags && note.tags.length > 0 && (
                <div className="tags">
                    {note.tags && note.tags.length > 0 && (
                        <div className="tags">
                            {note.tags.map((tag) =>
                            {
                                const key = tag.tag_id ? `builtIn-${tag.tag_id}` : tag.utag_id ? `custom-${tag.utag_id}` : Math.random().toString();
                                return <span key={key} className="tag">{tag.tag_name}</span>;
                            })}
                        </div>
                    )}
                </div>
            )}
            {showConfirmModal && (<Modal message={confirmModalConfig.message} buttons={confirmModalConfig.buttons} />)}
            {message && (<Modal message={message} buttons={[{label: "Close", action: () => setMessage("")}]} />)}
        </li>
    );
});