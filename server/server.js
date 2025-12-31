const express = require("express");
const app = express();
const db = require("./database.js");
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 3000;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" });
});

// --- COMMENTS API ---

// Get comments for a product
app.get("/api/comments/:productId", (req, res, next) => {
    const sql = "select * from comments where productId = ?";
    const params = [req.params.productId];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Post a new comment
app.post("/api/comments", (req, res, next) => {
    const errors = [];
    if (!req.body.productId) { errors.push("No productId specified"); }
    if (!req.body.content) { errors.push("No content specified"); }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    const data = {
        productId: req.body.productId,
        userId: req.body.userId,
        username: req.body.username,
        content: req.body.content,
        date: new Date().toISOString()
    }
    const sql = 'INSERT INTO comments (productId, userId, username, content, date) VALUES (?,?,?,?,?)'
    const params = [data.productId, data.userId, data.username, data.content, data.date]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

// --- ORDERS API ---

// Create a new order
app.post("/api/orders", (req, res, next) => {
    const data = {
        userId: req.body.userId,
        items: JSON.stringify(req.body.items), // Store items as JSON string
        totalAmount: req.body.totalAmount,
        status: "Pending",
        date: new Date().toISOString()
    }
    const sql = 'INSERT INTO orders (userId, items, totalAmount, status, date) VALUES (?,?,?,?,?)'
    const params = [data.userId, data.items, data.totalAmount, data.status, data.date]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

// Get orders for a user
app.get("/api/orders/user/:userId", (req, res, next) => {
    const sql = "select * from orders where userId = ?";
    const params = [req.params.userId];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Parse items back to JSON
        const orders = rows.map(row => ({ ...row, items: JSON.parse(row.items) }));
        res.json({
            "message": "success",
            "data": orders
        });
    });
});

// Get all orders (Admin)
app.get("/api/orders", (req, res, next) => {
    const sql = "select * from orders";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const orders = rows.map(row => ({ ...row, items: JSON.parse(row.items) }));
        res.json({
            "message": "success",
            "data": orders
        });
    });
});

// Update order status (Admin)
app.put("/api/orders/:id", (req, res, next) => {
    const data = {
        status: req.body.status
    }
    db.run(
        `UPDATE orders set status = ? WHERE id = ?`,
        [data.status, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
});
