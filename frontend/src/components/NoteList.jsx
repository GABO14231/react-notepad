import React, { useState } from "react";
import Note from "./Note";

const NoteList = () =>
{
    const [notes, setNotes] = useState([
        { id: 1, title: "First Note", content: "This is my first note" },
        { id: 2, title: "Second Note", content: "React is awesome!" },
    ]);

    return (
        <div>
            {notes.map((note) => (
                <Note key={note.id} title={note.title} content={note.content} />
            ))}
        </div>
    );
};

export default NoteList;