const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "emishop.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Create Comments Table
        db.run(`CREATE TABLE comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productId TEXT,
            userId TEXT,
            username TEXT,
            content TEXT,
            date TEXT
        )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    // var insert = 'INSERT INTO comments (productId, userId, username, content, date) VALUES (?,?,?,?,?)'
                    // db.run(insert, ["1", "user123", "John Doe", "Great product!", new Date().toISOString()])
                }
            });

        // Create Orders Table
        db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            items TEXT,
            totalAmount REAL,
            status TEXT,
            date TEXT
        )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created
                }
            });
    }
});

module.exports = db;
