const { Pool } = require("pg")
require("dotenv").config();


const pool = new Pool({
    user: "aadit",
    host: "localhost",
    database: "mydb",
    password: process.env.PASSWORD,
    port: 5432
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
})