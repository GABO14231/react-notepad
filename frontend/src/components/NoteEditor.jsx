import {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {TagDropdown} from "./TagDropdown";
import "../styles/NoteEditor.css";

const NoteEditor = () =>
{
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isPopout = new URLSearchParams(location.search).get("popout") === "true";
    const isNew = id === "new";
    const availableTags = ["Work", "Personal", "Important", "Idea", "Todo"];

    const [note, setNote] = useState({
        title: "",
        content: "",
        color: "#ffffff",
        tags: [],
    });

    useEffect(() =>
    {
        if (!isNew)
        {
            const fetchedNote =
            {
                title: `Note ${id}`,
                content: `This is detailed content for note ${id}. You may edit this content.`,
                color: "#f5f5f5",
                tags: ["Important", "Demo"],
            };
            setNote(fetchedNote);
        }
    }, [isNew, id]);

    const handleInputChange = useCallback((e) =>
    {
        const {name, value} = e.target;
        setNote((prevNote) => ({...prevNote, [name]: value}));
    }, []);

    const handleTagsChange = useCallback((tags) => {setNote((prevNote) => ({ ...prevNote, tags }));}, []);
    const handleSave = useCallback(() =>
    {
        alert("Note saved!");
        navigate("/notes");
    }, [navigate]);

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
        </div>
    );
};

export default NoteEditor;