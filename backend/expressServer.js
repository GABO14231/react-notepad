const express = require('express');
const {Pool} = require('pg');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

const app = express();
const port = 3001;

app.use(express.json());

const pool = new Pool({
    connectionString: `postgres://${config.username}:${config.password}@${config.ip}:${config.port}/${config.database}`,
    ssl: false
});

app.get('/db-test', async (req, res) =>
{
    try
    {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({status: 'success', time: result.rows[0]});
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({status: 'error', message: 'Database connection failed'});
    }
});

app.get('/', (req, res) => {res.send('Backend Server is running!');});

app.listen(port, () => {console.log(`Server running on port ${port}`);});