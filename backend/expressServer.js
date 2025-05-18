const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

const app = express();
const port = 3000;

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
    try
    {
        const existingUserQuery = `SELECT * FROM public.users WHERE email = $1 OR username = $2`;
        const existingUserResult = await pool.query(existingUserQuery, [email, username]);

        if (existingUserResult.rowCount > 0)
            return res.status(400).json({status: "error", message: "An user with this email or username already exists."});

        const query = `INSERT INTO public.users (email, username, user_password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const result = await pool.query(query, [email, username, password, first_name, last_name]);
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
        if (result.rowCount === 0) return res.status(400).json({status: "error", message: "User not found."});
        const user = result.rows[0];
        if (password !== user.user_password) return res.status(400).json({status: "error", message: "Invalid credentials."});
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
    const {username, email, first_name, last_name, currentPassword, newPassword, confirmPassword} = req.body;
    try
    {
        const userResult = await pool.query("SELECT user_password FROM users WHERE id_user = $1", [id]);
        if (userResult.rowCount === 0) return res.status(404).json({status: 'error', message: 'User not found'});

        let updateQuery = "";
        let values = [];

        if (currentPassword && newPassword && confirmPassword)
        {
            if (newPassword !== confirmPassword) return res.status(400).json({ status: 'error', message: 'New passwords do not match' });
            if (currentPassword !== userResult.rows[0].user_password) return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
            updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, user_password = $5 WHERE id_user = $6 RETURNING *;`;
            values = [username, email, first_name, last_name, newPassword, id];
        }
        else
        {
            updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4 WHERE id_user = $5 RETURNING *;`;
            values = [username, email, first_name, last_name, id];
        }

        const result = await pool.query(updateQuery, values);
        res.status(200).json({status: 'success', user: result.rows[0]});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'User update failed'});
    }
});

app.delete('/users/:id', async (req, res) =>
{
    const {id} = req.params;
    const {password} = req.body;
    try
    {
        const userResult = await pool.query("SELECT user_password FROM users WHERE id_user = $1", [id]);
        if (userResult.rowCount === 0) return res.status(404).json({status: 'error', message: 'User not found'});
        if (password !== userResult.rows[0].user_password) return res.status(400).json({status: 'error', message: 'Password is incorrect'});
        await pool.query("DELETE FROM users WHERE id_user = $1", [id]);
        res.status(200).json({status: 'success', message: 'User deleted'});
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({status: 'error', message: 'User deletion failed'});
    }
});

app.listen(port, () => {console.log(`Server running on port ${port}`);});