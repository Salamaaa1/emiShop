const sqlite3 = require('sqlite3').verbose();
const https = require('https');

const db = new sqlite3.Database('emishop.db');

function fetchProducts() {
    return new Promise((resolve, reject) => {
        https.get('https://dummyjson.com/products?limit=200', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        });
    });
}

async function seed() {
    console.log('Fetching all products...');
    const data = await fetchProducts();
    const products = data.products;

    console.log(`Fetched ${products.length} products. Inserting...`);

    db.serialize(() => {
        const stmt = db.prepare(`INSERT OR IGNORE INTO products 
            (id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images, sold) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`);

        products.forEach(p => {
            stmt.run(
                p.id,
                p.title,
                p.description,
                p.price,
                p.discountPercentage,
                p.rating, // Use API rating as initial base, or 0 if we want fresh
                p.stock,
                p.brand,
                p.category,
                p.thumbnail,
                JSON.stringify(p.images)
            );
        });

        stmt.finalize(() => {
            console.log('Insertion complete.');
            db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
                console.log("Total products in DB:", row.count);
            });
        });
    });
}

seed();
