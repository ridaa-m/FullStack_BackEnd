//Environment Configuration
//This loads the environments variables from the .env file into process.env
require('dotenv').config();


//package imports
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');



// Create Express App
const app = express();

// Log that the server file has been loaded in terminal
console.log('SERVER FILE LOADED');

// Middleware

//cors middleware to allow cross-origin requests
//JSON middleware to parse incoming JSON requests

app.use(cors());
app.use(express.json());



// Logger Middleware
// This middleware logs the HTTP method and URL of each incoming request to the console, along with a timestamp. It helps in monitoring and debugging the server's activity.

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.url}`
    );
    next();
});

// Static Image Middleware
// This middleware serves static files from the 'public/images' directory when requests are made to the '/images' route. It allows clients to access images stored on the server.
app.use('/images', express.static('public/images'));

// MongoDB Connection
// This section establishes a connection to the MongoDB database using the MongoClient from the 'mongodb' package. It connects to the database specified in the MONGODB_URI environment variable and logs the connection status.
const client = new MongoClient(process.env.MONGODB_URI);


// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('✅ MongoDB has successfully Connected');
    } catch (error) {
        console.error('❌ Database Connection has Failed');
        console.error(error);
    }
}

connectDB();

// Home Route
// This route responds to GET requests made to the root URL ('/'). It sends a simple message indicating that the backend server is running.
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Test Route
// This route responds to GET requests made to the '/test' URL. It logs a message to the console and sends a response indicating that the test route is working.
app.get('/test', (req, res) => {
    console.log('TEST ROUTE HIT');
    res.send('TEST ROUTE WORKS!!!!');
});

// GET all Lessons

app.get('/lessons', async (req, res) => {
    try {
        // Log that the lessons route has been hit
        console.log('LESSONS ROUTE HIT');


        // Fetch all lessons from the 'lessons' collection in the 'afterschool' database
        const lessons = await client
            .db('afterschool')
            .collection('lessons')
            .find({})
            .toArray();

        res.json(lessons);

        // Log the number of lessons fetched
    } catch (error) {
        console.error(error);

        // Send a 500 Internal Server Error response if fetching lessons fails
        res.status(500).json({
            error: 'Failed to fetch lessons'
        });
    }
});

// CREATE ORDER
// This route handles POST requests to create a new order. It expects the order data in the request body, inserts it into the 'orders' collection in the 'afterschool' database, and responds with a success message and the inserted order ID. If an error occurs during the process, it logs the error and sends a 500 Internal Server Error response.
app.post('/order', async (req, res) => {
    try {
        const order = req.body;

        const result = await client
            .db('afterschool')
            .collection('orders')
            .insertOne(order);
        // Log the inserted order ID
        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertedId
        });

    } catch (error) {
        console.error(error);
        // Send a 500 Internal Server Error response if creating the order fails
        res.status(500).json({
            error: 'Failed to create order'
        });
    }
});

// UPDATE LESSON

app.put('/lesson/:id', async (req, res) => {
    try {
        const lessonId = req.params.id;

        const result = await client
            .db('afterschool')
            .collection('lessons')
            .updateOne(
                { _id: new ObjectId(lessonId) },
                { $set: req.body }
            );
            // Log the number of modified documents
        res.json({
            message: 'Lesson updated successfully',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error(error);
        // Send a 500 Internal Server Error response if updating the lesson fails
        res.status(500).json({
            error: 'Failed to update lesson'
        });
    }
});

// Start Server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});


