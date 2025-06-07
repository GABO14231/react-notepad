import {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {TagDropdown} from "./TagDropdown";
import {addNotes, editNotes, getNotes, getTags} from "../components/NoteManagement";
import Modal from "./Modal";
import "../styles/NoteEditor.css";

const NoteEditor = ({user}) =>
{
    const {id} = useParams();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const isPopout = new URLSearchParams(location.search).get("popout") === "true";
    const isNew = id === "new";

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() =>
    {
        const fetchAvailableTags = async () =>
        {
            const result = await getTags(user.id_user);
            if (result.ok && result.data?.tags)
            {
                const builtInTags = result.data.tags.builtIn || [];
                const customTags = result.data.tags.custom || [];
                const allTags = [...builtInTags.map((tag) => ({id: parseInt(tag.id_tags, 10),
                    name: tag.tag_name,type: "builtIn", key: `builtIn-${tag.id_tags}`,})),
                    ...customTags.map((tag) => ({id: parseInt(tag.id_utags, 10), name: tag.utag_name,
                    type: "custom", key: `custom-${tag.id_utags}`,})),];
                setAvailableTags(allTags);
            }
            else setAvailableTags([]);
        };
        fetchAvailableTags();
    }, [user]);

    const [note, setNote] = useState({title: "", content: "", color: "#ffffff", tags: []});

    useEffect(() =>
    {
        if (!isNew)
        {
            const fetchNoteData = async () =>
            {
                const result = await getNotes(user.id_user);
                if (result.ok && result.data?.notes)
                {
                    const currentNoteRaw = result.data.notes.find((n) => String(n.id_note) === id);
                    if (currentNoteRaw)
                    {
                        const normalizedNote =
                        {
                            id: currentNoteRaw.id_note,
                            title: currentNoteRaw.note_title,
                            content: currentNoteRaw.note_content,
                            color: currentNoteRaw.note_color,
                            tags: currentNoteRaw.tags || [],
                        };
                        setNote(normalizedNote);
                    }
                    else
                    {
                        console.error("Note not found");
                        setMessage("No note found.")
                    }
                }
                else
                {
                    console.error("Failed to fetch note data");
                    setMessage("Failed to fetch note data.")
                }
            };
            fetchNoteData();
        }
    }, [isNew, id, user]);

    const handleInputChange = useCallback((e) => {const {name, value} = e.target; setNote((prevNote) => ({...prevNote, [name]: value}));}, []);
    const handleTagsChange = useCallback((tags) => {setNote((prevNote) => ({ ...prevNote, tags }));}, []);
    const handleSave = useCallback(async () =>
    {
        try
        {
            let result;
            const systemTags = note.tags.filter((tag) => tag.type === "builtIn").map((tag) => tag.id);
            const userTags = note.tags.filter((tag) => tag.type === "custom").map((tag) => tag.id);
            const payload = { system_tags: systemTags, user_tags: userTags };

            if (isNew) result = await addNotes(user.id_user, note.title, note.content, note.color, payload);
            else result = await editNotes(note.id, note.title, note.content, note.color, payload);

            if (result.ok)
            {
                console.log(isNew ? "Note added successfully!" : "Note updated successfully!");
                setMessage(isNew ? "Note added successfully!" : "Note updated successfully!")
                navigate("/notes");
            }
            else
            {
                console.log("Error saving note: " + result.data.message);
                setMessage("Error saving note: " + result.data.message);
            }
        }
        catch (error)
        {
            console.error("Save error:", error);
            setMessage("An unexpected error occurred. Please try again.");
        }
    }, [isNew, note, navigate, user]);

    const handleCancel = useCallback(() =>
    {
        if (isPopout) window.close();
        else navigate("/notes");
    }, [navigate, isPopout]);

    const handlePopOut = useCallback(() =>
    {
        const url = `${window.location.origin}${window.location.pathname}?popout=true`;
        const popWindow = window.open(url, "_blank", "width=800,height=600");
        window.popOutEditor = popWindow;
        navigate("/notes");
    }, [navigate]);

    const handlePopIn = useCallback(() =>
    {
        const newUrl = window.location.href.replace("?popout=true", "");
        if (window.opener && !window.opener.closed) window.opener.location.href = newUrl;
        window.close();
    }, []);

    return (
        <div className="note-detail">
            <header className="detail-header">
                <h1>{isNew ? "New Note" : "Edit Note"}</h1>
            </header>
            <div className="detail-body">
                <form className="note-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="note-title">Title:</label>
                        <input id="note-title" type="text" name="title"
                            value={note.title} onChange={handleInputChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note-content">Content:</label>
                        <textarea id="note-content" name="content" value={note.content} onChange={handleInputChange}
                            rows="10" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note-color">Color:</label>
                        <input id="note-color" type="color" name="color" value={note.color}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Select Tags:</label>
                        <TagDropdown availableTags={availableTags} selectedTags={note.tags} onChange={handleTagsChange}/>
                    </div>
                </form>
            </div>
            <footer className="detail-footer">
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
                {!isPopout && (<button type="button" onClick={handlePopOut}>Pop Out Editor</button>)}
                {isPopout && (<button type="button" onClick={handlePopIn}>Pop In Editor</button>)}
            </footer>
            <Modal message={message} buttons={[{label: "Close", action: () => setMessage("")}]} />
        </div>
    );
};

export default NoteEditor;