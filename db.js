const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((error) => {
    if (error) {
        console.log("Database connection failed!");
        console.log(error.message);
        return;
    }

    console.log("Database connected successfully!");
});

module.exports = db;