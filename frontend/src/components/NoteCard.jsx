import {memo, useState} from "react";
import {FaTrash} from "react-icons/fa";
import Modal from "../components/Modal";

const createSnippet = (content, length) =>
    content.length > length ? content.substring(0, length) + "..." : content;

export const NoteCard = memo(({note, onClick, onDelete}) =>
{
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalConfig, setConfirmModalConfig] = useState({message: "", buttons: []});

    const handleDelete = (e) =>
    {
        e.stopPropagation();
        onDelete(note.id);
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
        <div className="note-card" style={{backgroundColor: note.color}} onClick={() => onClick(note.id)}
            role="button" tabIndex={0} onKeyDown={(e) => {if (e.key === "Enter") onClick(note.id);}}
            aria-label={`Open note: ${note.title}`}>
            <div className="note-header">
                <h2>{note.title}</h2>
                <button className="delete-button" onClick={(e) => {e.stopPropagation(); confirmDeleteNote();}}><FaTrash /></button>
            </div>
            <p>{createSnippet(note.content, 50)}</p>
            {note.tags && note.tags.length > 0 && (
                <div className="tags">
                    {note.tags.map((tag, i) => (
                        <span key={i} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {showConfirmModal && (<Modal message={confirmModalConfig.message} buttons={confirmModalConfig.buttons} />)}
        </div>
      );
});