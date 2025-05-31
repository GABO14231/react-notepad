export const registerUser = async (input) =>
{
    const response = await fetch("http://localhost:3000/users/register",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(input),
    });
    const data = await response.json();
    return {ok: response.ok, data};
};

export const loginUser = async (input) =>
{
    const response = await fetch("http://localhost:3000/users/login",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(input)
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const loadProfile = async (form, profileData) =>
{
    const response = await fetch(`http://localhost:3000/users/${profileData.id_user}`,
    {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
    });
    const data = await response.json();
    return {ok: response.ok, data};
}

export const updateCode = async (id) =>
{
    const response = await fetch(`http://localhost:3000/users/${id}/updatecode`,
    {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
    });
    const data = await response.json();
    return {ok: response.ok, data}
}

export const deleteProfile = async (password, id) =>
{
    const response = await fetch(`http://localhost:3000/users/${id}`,
    {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({password})
    });
    const data = await response.json();
    return {ok: response.ok, data};
}