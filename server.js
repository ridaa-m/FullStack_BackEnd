require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Database Connection Failed');
        console.error(error);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.send('Backend is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});