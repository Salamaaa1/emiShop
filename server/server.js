const express = require("express");
const app = express();
const db = require("./database.js");
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const JWT_SECRET = "j_aime_angularrr_HHHHHH";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 3001;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" });
});

// Mock Auth Endpoint (Exchange Firebase User for Backend JWT)
// In a real app, you'd verify the Firebase ID Token here.
app.post("/api/auth/token", (req, res) => {
    const user = req.body; // Expecting { email, uid, username }
    if (!user || !user.uid) {
        return res.status(400).json({ error: "User data required" });
    }

    // Assign Admin Role if email matches
    if (user.email === 'admin@emishop.com') {
        user.role = 'admin';
    }

    // Sign token with our secret
    jwt.sign({ user }, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) return res.status(500).json({ error: "Error signing token" });
        res.json({ token, user }); // Return user with role
    });
});



// --- COMMENTS API ---

// Get comments for a product (Public)
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

// Post a new comment (Secured & Verified Purchaser)
app.post("/api/comments", verifyToken, (req, res, next) => {
    const errors = [];
    if (!req.body.productId) { errors.push("No productId specified"); }
    if (!req.body.content) { errors.push("No content specified"); }
    if (!req.body.rating) { errors.push("No rating specified"); }

    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    const { productId, userId, username, content, rating } = req.body;

    // Verify if user bought the product
    const purchaseSql = "SELECT * FROM orders WHERE userId = ? AND items LIKE ?";
    const searchPattern = `%"id":${productId}%`; // Verify item id exists in JSON string
    // Note: This is a basic check. Better JSON parsing or optimized schema recommended for production.

    // For admin, bypass check (optional, but requested only users who commanded can rank)
    // The requirement says "only submitted by the users and only those how commanded".

    db.get(purchaseSql, [userId, searchPattern], (err, row) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }

        // If no order found with this product
        if (!row) {
            // For testing purposes, we might want to allow it if we can't easily simulate orders, 
            // but user explicitly asked "only those how commanded".
            res.status(403).json({ "error": "You can only rate products you have purchased." });
            return;
        }

        const data = {
            productId,
            userId,
            username,
            content,
            rating, // Add rating
            date: new Date().toISOString()
        }
        const sql = 'INSERT INTO comments (productId, userId, username, content, rating, date) VALUES (?,?,?,?,?,?)'
        const params = [data.productId, data.userId, data.username, data.content, data.rating, data.date]
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
})

// --- ORDERS API ---

// Create a new order (Secured)
app.post("/api/orders", verifyToken, (req, res, next) => {
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

// Get orders for a user (Secured)
app.get("/api/orders/user/:userId", verifyToken, (req, res, next) => {
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

// Get all orders (Admin Only) (Secured)
app.get("/api/orders", verifyToken, (req, res, next) => {
    // Check for admin role
    if (req.authData.user.role !== 'admin') {
        return res.status(403).json({ "error": "Admin access required" });
    }

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

// Update order status (Admin) (Secured)
app.put("/api/orders/:id", verifyToken, (req, res, next) => {
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

// Delete a comment (Admin Only)
app.delete("/api/comments/:id", verifyToken, (req, res) => {
    if (req.authData.user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
    }
    db.run("DELETE FROM comments WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "deleted", changes: this.changes });
    });
});

// --- USERS API ---

// Create User (Internal/Sync)
app.post("/api/users", (req, res) => {
    const { uid, email, displayName, role } = req.body;
    const date = new Date().toISOString();
    const sql = "INSERT INTO users (uid, email, displayName, role, date) VALUES (?,?,?,?,?)";
    db.run(sql, [uid, email, displayName, role || 'user', date], function (err) {
        if (err) {
            // Ignore unique constraint error for sync
            if (err.message.includes('UNIQUE')) return res.json({ message: "User exists" });
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "success", id: this.lastID });
    });
});

// Get all users (Admin Only)
app.get("/api/users", verifyToken, (req, res) => {
    if (req.authData.user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
    }
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// --- PRODUCTS API ---

// Get all products (Public)
app.get("/api/products", (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        const products = rows.map(p => ({ ...p, images: JSON.parse(p.images) }));
        res.json({ products: products, total: products.length, skip: 0, limit: products.length });
    });
});

// Get single product
app.get("/api/products/:id", (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Product not found" });
        row.images = JSON.parse(row.images);
        res.json(row);
    });
});

// Add Product (Admin Only)
app.post("/api/products", verifyToken, (req, res) => {
    if (req.authData.user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
    }
    const { title, description, price, brand, category, thumbnail, images } = req.body;
    const sql = `INSERT INTO products (title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images) 
                 VALUES (?, ?, ?, 0, 0, 100, ?, ?, ?, ?)`;
    const params = [title, description, price, brand, category, thumbnail, JSON.stringify(images || [])];

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", id: this.lastID });
    });
});
