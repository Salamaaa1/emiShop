const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const USERS = Array.from({ length: 5 }, (_, i) => ({
    email: `student${i + 1}@emi.ac.ma`,
    password: 'password123',
    username: `Student ${i + 1}`
}));

const REVIEWS_GOOD = [
    "wa3er", "hrban", "produit zwin bzaf", "top du top", "nadi", "mzyan bzaf", "excellent quality"
];

const REVIEWS_BAD = [
    "hadchi khayb", "maystahl daja", "its a scam", "la relation", "makayn walo", "fragile"
];

async function seed() {
    console.log('Starting review seeding...');

    // 1. Get/Create Users & Tokens
    const userTokens = [];
    for (const u of USERS) {
        try {
            // Register or Login (using auth token endpoint for simplicity)
            // Ideally we login with firebase but here we mock it by getting a token directly if we assume they exist 
            // OR we use the /api/auth/token endpoint provided we simulated the firebase UID.
            // Let's generate a fake UID for them.
            const uid = `user_${u.email}`;

            // Register internal user if needed (sync)
            await axios.post(`${API_URL}/users`, { uid, email: u.email, displayName: u.username });

            // Get Token
            const res = await axios.post(`${API_URL}/auth/token`, {
                uid, email: u.email, username: u.username
            });
            userTokens.push({ token: res.data.token, uid });
            console.log(`Logged in ${u.username}`);
        } catch (e) {
            console.error(`Failed to login ${u.email}:`, e.message);
        }
    }

    // 2. Get Products
    let products = [];
    try {
        const res = await axios.get(`${API_URL}/products`);
        products = res.data.products;
    } catch (e) {
        console.error('Failed to get products');
        return;
    }

    if (products.length === 0) {
        console.log('No products found. Seed products first.');
        return;
    }

    // 3. Simulate Orders and Reviews
    for (let i = 0; i < 20; i++) { // Create 20 reviews
        const user = userTokens[Math.floor(Math.random() * userTokens.length)];
        const product = products[Math.floor(Math.random() * products.length)];

        // Decide sentiment
        const isGood = Math.random() > 0.3; // 70% good
        const content = isGood
            ? REVIEWS_GOOD[Math.floor(Math.random() * REVIEWS_GOOD.length)]
            : REVIEWS_BAD[Math.floor(Math.random() * REVIEWS_BAD.length)];
        const rating = isGood ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 2) + 1); // 4-5 or 1-2

        try {
            const headers = { Authorization: `Bearer ${user.token}` };

            // Place Order
            const orderData = {
                userId: user.uid,
                items: [{ product: product, quantity: 1 }],
                totalAmount: product.price
            };
            await axios.post(`${API_URL}/orders`, orderData, { headers });

            // Post Comment
            const commentData = {
                productId: product.id,
                userId: user.uid,
                username: `Student ${user.uid.split('_')[1]}`, // rough username
                content: content,
                rating: rating
            };
            await axios.post(`${API_URL}/comments`, commentData, { headers });

            console.log(`Review added: ${rating}* for ${product.title} -> "${content}"`);

        } catch (e) {
            console.error(`Failed to seed review for ${product.title}:`, e.response?.data?.error || e.message);
        }
    }

    console.log('Seeding complete.');
}

seed();
