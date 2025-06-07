export const addNotes = async (id, title, content, color, id_tag) =>
{
    const response = await fetch(`http://localhost:3000/addnotes`,
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, title, content, color, id_tag})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const deleteNotes = async (id) =>
{
    const response = await fetch(`http://localhost:3000/deletenotes`,
    {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const deleteTags = async (id) =>
{
    const response = await fetch(`http://localhost:3000/deletetags`,
    {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const editNotes = async (id, title, content, color, tags) =>
{
    const response = await fetch(`http://localhost:3000/editnotes`,
    {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, title, content, color, tags})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const getNotes = async (id) =>
{
    const response = await fetch('http://localhost:3000/getnotes',
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const addTags = async (id, tags) =>
{
    const response = await fetch(`http://localhost:3000/addtags`,
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, tags})
    });
    const data = await response.json();
    return {ok: response.ok, data};    
}

export const getTags = async (id) =>
{
    const response = await fetch('http://localhost:3000/gettags',
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}