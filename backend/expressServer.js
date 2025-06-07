const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

const app = express();
const port = 3000;

const generateRecoveryCode = () =>
{
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++)
    {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

app.use(cors());
app.use(express.json());

const pool = new Pool
({
    connectionString: `postgres://${config.username}:${config.password}@${config.ip}:${config.port}/${config.database}`,
    ssl: false
});

app.post('/users/register', async (req, res) =>
{
    const {username, email, password, first_name, last_name} = req.body;
    const code = generateRecoveryCode();
    try
    {
        const existingUserQuery = `SELECT * FROM public.users WHERE email = $1 OR username = $2`;
        const existingUserResult = await pool.query(existingUserQuery, [email, username]);

        if (existingUserResult.rowCount > 0)
        {
            console.log(`ERROR: User already exists.`);
            return res.status(400).json({status: "error", message: "An user with this email or username already exists."});
        }

        const query = `INSERT INTO public.users (email, username, user_password, first_name, last_name, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const result = await pool.query(query, [email, username, password, first_name, last_name, code]);
        console.log(`Registered new user: ${username}`);
        res.status(200).json({status: "success", message: "User registered!", user: result.rows[0]});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: "error", message: "Registration failed"});
    }
});

app.post('/users/login', async (req, res) =>
{
    const {identifier, password} = req.body;
    try
    {
        const query = identifier.includes("@") ? "SELECT * FROM public.users WHERE email = $1" : "SELECT * FROM public.users WHERE username = $1";
        const values = [identifier];
        const result = await pool.query(query, values);
        if (result.rowCount === 0)
        {
            console.log(`ERROR: User could not be found.`);
            return res.status(400).json({status: "error", message: "User not found."});
        }
        const user = result.rows[0];
        if (password !== user.user_password)
        {
            console.log(`ERROR: Incorrect credentials.`);
            return res.status(400).json({status: "error", message: "Invalid credentials."});
        }
        console.log(`User logged in: ${identifier}`);
        res.status(200).json({status: "success", message: "Successful login!", user});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: "error", message: "An error occurred during login."});
    }
});

app.put('/users/:id', async (req, res) =>
{
    const {id} = req.params;
    const {username, email, first_name, last_name, currentPassword, newPassword} = req.body;
    try
    {
        const userResult = await pool.query("SELECT user_password FROM users WHERE id_user = $1", [id]);
        if (userResult.rowCount === 0)
        {
            console.log(`ERROR: User was not found.`);
            return res.status(404).json({status: 'error', message: 'User not found'});
        }

        let updateQuery = "";
        let values = [];

        if (currentPassword && newPassword)
        {
            if (currentPassword !== userResult.rows[0].user_password)
            {
                console.log(`ERROR: Current password is incorrect.`);
                return res.status(400).json({status: 'error', message: 'Current password is incorrect'});
            }
            updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, user_password = $5 WHERE id_user = $6 RETURNING *;`;
            values = [username, email, first_name, last_name, newPassword, id];
        }
        else
        {
            updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4 WHERE id_user = $5 RETURNING *;`;
            values = [username, email, first_name, last_name, id];
        }

        const result = await pool.query(updateQuery, values);
        console.log(`User updated: ${username}`);
        res.status(200).json({status: 'success', message: 'User updated successfully', user: result.rows[0]});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'User update failed'});
    }
});

app.put('/users/:id/updatecode', async (req, res) =>
{
    const {id} = req.params;
    try
    {
        const newCode = generateRecoveryCode();
        const result = await pool.query(`UPDATE users SET code = $1 WHERE id_user = $2 RETURNING *;`, [newCode, id]);
        console.log(`Code updated: ${newCode}`);
        res.status(200).json({status: 'success', message: 'Code updated successfully', user: result.rows[0]});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Code update failed'});
    }
});

app.put('/recoverpass', async (req, res) =>
{
    const {code, newPassword} = req.body;
    try
    {
        const idQuery = await pool.query("SELECT id_user FROM users WHERE code = $1", [code]);
        if (idQuery.rowCount === 0)
        {
            console.log(`ERROR: The recovery code is invalid.`);
            return res.status(400).json({status: 'error', message: 'Invalid recovery code'});
        }
        else
        {
            const id = idQuery.rows[0].id_user;
            const passwordQuery = await pool.query("SELECT user_password FROM users where id_user = $1", [id]);
            if (newPassword === passwordQuery.rows[0].user_password)
            {
                console.log(`ERROR: This is your current password.`);
                return res.status(400).json({status: 'error', message: 'This is your current password'});                    
            }
            else
            {
                const newCode = generateRecoveryCode();
                const values = [newCode, newPassword, id];
                await pool.query(`UPDATE users SET code = $1, user_password = $2 WHERE id_user = $3 RETURNING *;`, values);
                console.log('Password and recovery code updated');
                res.status(200).json({status: 'success', message: 'Password recovered successfully'});
            }
        }
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Password recovery failed'});
    }
});

app.delete('/users/:id', async (req, res) =>
{
    const {id} = req.params;
    const {password} = req.body;

    try
    {
        const userResult = await pool.query("SELECT user_password FROM users WHERE id_user = $1;", [id]);
        if (userResult.rowCount === 0)
        {
            console.log(`ERROR: User could not be found.`);
            return res.status(404).json({status: 'error', message: 'User not found'});
        }
        if (password !== userResult.rows[0].user_password)
        {
            console.log(`ERROR: Password is incorrect.`);
            return res.status(400).json({status: 'error', message: 'Password is incorrect'});
        }

        await pool.query("DELETE FROM users WHERE id_user = $1;", [id]);

        const checkUsers = await pool.query("SELECT * FROM users;");
        if (checkUsers.rowCount === 0) await pool.query("ALTER SEQUENCE users_id_user_seq RESTART;");
        else
        {
            await pool.query(`WITH updated AS (SELECT id_user, ROW_NUMBER() OVER (ORDER BY id_user) AS new_id FROM users) UPDATE users SET id_user = updated.new_id FROM updated WHERE users.id_user = updated.id_user;`);
            await pool.query("SELECT setval('users_id_user_seq', COALESCE((SELECT MAX(id_user) FROM users), 0) + 1);");
        }
        console.log(`User deleted and IDs corrected.`);
        res.status(200).json({status: 'success', message: 'User deleted and IDs renumbered.'});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'User deletion failed.'});
    }
});

app.post('/addnotes', async (req, res) =>
{
    const {id, title, content, color, id_tag} = req.body;
    try
    {
        const noteInsertQuery = `INSERT INTO notes (note_owner, note_title, note_content, note_color)
            VALUES ($1, $2, $3, $4) RETURNING id_note;`;
        const noteResult = await pool.query(noteInsertQuery, [id, title, content, color]);
        const insertedNoteId = noteResult.rows[0].id_note;
        const tagInsertPromises = [];

        if (id_tag)
        {
            if (Array.isArray(id_tag.system_tags))
            {
                for (let systemTagId of id_tag.system_tags)
                {
                    const sysTagQuery = `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2);`;
                    tagInsertPromises.push(pool.query(sysTagQuery, [insertedNoteId, systemTagId]));
                }
            }
            if (Array.isArray(id_tag.user_tags))
            {
                for (let userTagId of id_tag.user_tags)
                {
                    const userTagQuery = `INSERT INTO note_tags (note_id, utag_id) VALUES ($1, $2);`;
                    tagInsertPromises.push(pool.query(userTagQuery, [insertedNoteId, userTagId]));
                }
            }
        }          

        if (tagInsertPromises.length > 0) await Promise.all(tagInsertPromises);
        else res.status(200).json({status: 'success', message: 'Note added successfully', note_id: insertedNoteId});
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json({status: 'error', message: 'Failed to add note'});
    }
});

app.post('/addtags', async (req, res) =>
{
    const {id, tags} = req.body;

    try
    {
        const query = `INSERT INTO user_tags (user_id, utag_name) VALUES ($1, $2) RETURNING *;`;
        const result = await pool.query(query, [id, tags]);
        if (result.rowCount !== 0) res.status(400).json({status: 'error', message: 'Failed to add tag'});
        else res.status(200).json({ status: 'success', message: 'Tag added successfully', tag: result.rows[0] });
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to add tag'});
    }
});  

app.post('/gettags', async (req, res) =>
{
    const {id} = req.body;
    try
    {
        const customResult = await pool.query("SELECT * FROM user_tags WHERE user_id = $1", [id]);
        const customTags = customResult.rowCount ? customResult.rows : [];
        const builtInResult = await pool.query("SELECT * FROM tags");
        const builtInTags = builtInResult.rowCount ? builtInResult.rows : [];
        res.status(200).json({status: 'success', message: 'Retrieved tags!', tags: {custom: customTags, builtIn: builtInTags}});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to retrieve tags'});
    }
});  

app.put('/editnotes', async (req, res) =>
{
    const {id, title, content, color, tags} = req.body;

    try
    {
        const updateNoteQuery = `UPDATE notes SET note_title = $1, note_content = $2, note_color = $3 WHERE id_note = $4 RETURNING *;`;
        const noteResult = await pool.query(updateNoteQuery, [title, content, color, id]);

        if (noteResult.rowCount === 0)
        {
            console.log(`ERROR: Note with id ${id} not found.`);
            return res.status(404).json({status: 'error', message: 'Note not found'});
        }

        await pool.query("DELETE FROM note_tags WHERE note_id = $1", [id]);
        let tagInsertPromises = [];

        if (tags)
        {
            if (Array.isArray(tags.system_tags))
            {
                for (let systemTag of tags.system_tags)
                {
                    const sysTagQuery = `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)`;
                    tagInsertPromises.push(pool.query(sysTagQuery, [id, systemTag]));
                }
            }
            if (Array.isArray(tags.user_tags))
            {
                for (let userTag of note_tags.user_tags)
                {
                    const userTagQuery = `INSERT INTO note_tags (note_id, utag_id) VALUES ($1, $2)`;
                    tagInsertPromises.push(pool.query(userTagQuery, [id, userTag]));
                }
            }
        }

        if (tagInsertPromises.length > 0) await Promise.all(tagInsertPromises);
        else res.status(200).json({status: 'success', message: 'Note updated successfully', note: noteResult.rows[0]});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to update note'});
    }
});  

app.post('/getnotes', async (req, res) =>
{
    const {id} = req.body;

    try
    {
        const notesResult = await pool.query(`SELECT n.*, COALESCE(json_agg(json_build_object('tag_id', nt.tag_id,
            'utag_id', nt.utag_id, 'tag_name', CASE WHEN nt.tag_id IS NOT NULL THEN t.tag_name ELSE ut.utag_name END))
            FILTER (WHERE nt.tag_id IS NOT NULL OR nt.utag_id IS NOT NULL), '[]') AS tags FROM notes n
            LEFT JOIN note_tags nt ON n.id_note = nt.note_id LEFT JOIN tags t ON nt.tag_id = t.id_tags
            LEFT JOIN user_tags ut ON nt.utag_id = ut.id_utags WHERE n.note_owner = $1 GROUP BY n.id_note;`, [id]);

        if (notesResult.rowCount === 0)
        {
            console.log(`ERROR: User has no notes!`);
            res.status(400).json({status: 'error', message: 'User has no notes'});
        }
        else res.status(200).json({status: 'success', message: 'Retrieved notes!', notes: notesResult.rows});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Failed to get note information.'});
    }
});  

app.delete('/deletenotes', async (req, res) =>
{
    const {id} = req.body;
    try
    {
        const noteCheck = await pool.query("SELECT * FROM notes WHERE id_note = $1", [id]);
        if (noteCheck.rowCount === 0)
        {
            console.log(`ERROR: Note with id ${id} not found.`);
            return res.status(404).json({status: 'error', message: 'Note not found'});
        }

        await pool.query("DELETE FROM note_tags WHERE note_id = $1", [id]);
        await pool.query("DELETE FROM notes WHERE id_note = $1", [id]);
        const checkNotes = await pool.query("SELECT * FROM notes;");
        if (checkNotes.rowCount === 0) await pool.query("ALTER SEQUENCE note_tags_id_note_tag_seq RESTART;");
        else
        {
            await pool.query(`WITH updated AS (SELECT id_note, ROW_NUMBER() OVER (ORDER BY id_note) AS new_id FROM notes)
                UPDATE notes SET id_note = updated.new_id FROM updated WHERE notes.id_note = updated.id_note;`);
            await pool.query("SELECT setval('note_tags_id_note_tag_seq', COALESCE((SELECT MAX(id_note) FROM notes), 0) + 1);");
        }

        const checkNoteTags = await pool.query("SELECT * FROM note_tags;");
        if (checkNoteTags.rowCount === 0) await pool.query("ALTER SEQUENCE note_tags_id_note_tag_seq RESTART;");
        else
        {
            await pool.query(`WITH updated AS (SELECT id_note_tag, ROW_NUMBER() OVER (ORDER BY id_note_tag) AS new_id 
                FROM note_tags) UPDATE note_tags SET id_note_tag = updated.new_id FROM updated WHERE note_tags.id_note_tag = updated.id_note_tag;`);
            await pool.query("SELECT setval('note_tags_id_note_tag_seq', COALESCE((SELECT MAX(id_note_tag) FROM note_tags), 0) + 1);");
        }

        console.log(`Note with id ${id} deleted and sequences corrected.`);
        res.status(200).json({status: 'success', message: 'Note deleted and sequences updated'});
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json({status: 'error', message: 'Failed to delete note'});
    }
});

app.delete('/deletetags', async (req, res) =>
{
    const {id} = req.body;
    try
    {
        const deleteReferencesQuery = `DELETE FROM note_tags WHERE utag_id = $1;`;
        await pool.query(deleteReferencesQuery, [id]);
        const deleteTagQuery = `DELETE FROM user_tags WHERE id_utags = $1 RETURNING id_utags;`;
        const result = await pool.query(deleteTagQuery, [id]);

        const checkUserTags = await pool.query("SELECT * FROM user_tags;");
        if (checkUserTags.rowCount === 0) await pool.query("ALTER SEQUENCE user_tags_id_utags_seq RESTART;");
        else
        {
            await pool.query(`WITH updated AS (SELECT id_utags, ROW_NUMBER() OVER (ORDER BY id_utags) AS new_id FROM user_tags)
                UPDATE user_tags SET id_utags = updated.new_id FROM updated WHERE user_tags.id_utags = updated.id_utags;`);
            await pool.query("SELECT setval('user_tags_id_utags_seq', COALESCE((SELECT MAX(id_utags) FROM user_tags), 0) + 1);");
        }
        const checkNoteTags = await pool.query("SELECT * FROM note_tags;");
        if (checkNoteTags.rowCount === 0) await pool.query("ALTER SEQUENCE note_tags_id_note_tag_seq RESTART;");
        else
        {
            await pool.query(`WITH updated AS (SELECT id_note_tag, ROW_NUMBER() OVER (ORDER BY id_note_tag) AS new_id FROM note_tags)
                UPDATE note_tags SET id_note_tag = updated.new_id FROM updated WHERE note_tags.id_note_tag = updated.id_note_tag;`);
            await pool.query("SELECT setval('note_tags_id_note_tag_seq', COALESCE((SELECT MAX(id_note_tag) FROM note_tags), 0) + 1);");
        }

        if (result.rowCount === 0) res.status(400).json({status: "error", message: "Tag not found."});
        else res.status(200).json({status: "success", message: "Tag deleted successfully."});
    }
    catch (error)
    {
        console.error("Error deleting tag:", error);
        res.status(500).json({ status: "error", message: "Internal server error." });
    }
});  

app.listen(port, () => console.log(`Server running on port ${port}`));