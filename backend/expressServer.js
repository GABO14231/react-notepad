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
        res.status(201).json({status: "success", message: "User registered!", user: result.rows[0]});
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
        res.status(200).json({status: 'success', message: 'User updated successfully',user: result.rows[0]});
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

app.listen(port, () => console.log(`Server running on port ${port}`));