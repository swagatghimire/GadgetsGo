const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User')
// Import the database connection function
const connectDB = require('./db'); // Ensure this path is correct

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allow dynamic origins based on the request's origin
app.use(cors({
    origin: (origin, callback) => {
        // Check if the origin is undefined (e.g., for localhost)
        if (!origin || origin.includes('localhost')) {
            // Allow any localhost origin
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));


app.use(bodyParser.json());

// Khalti configuration
const KHALTI_SECRET_KEY = '3665f37741c1431c8fdbedff75a3febd'; // Your secret key

// Endpoint to initialize Khalti payment
app.post('/initialize-khalti', async (req, res) => {
    const purchase_order_id = Math.random().toString(36).substring(2, 15); // Random order ID
    const amount = req.body.amount; // Get amount from request body

    try {
        const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/', {
            return_url: 'http://localhost:3000/complete-payment',
            website_url: 'http://localhost:3000',
            amount: amount,
            purchase_order_id: purchase_order_id,
            purchase_order_name: 'Purchase Item',
            customer_info: {
                name: 'Customer Name',
                email: 'customer@example.com',
                phone: '9800000001'
            }
        }, {
            headers: {
                'Authorization': `key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.send({
            success: true,
            payment_url: response.data.payment_url,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to handle complete payment
app.get('/complete-payment', (req, res) => {
    const { pidx, status } = req.query; // Extract pidx and status from query parameters

    if (status === 'Completed') {
        // If payment is completed, redirect to Khalti confirmation page
        const redirectUrl = `https://test-pay.khalti.com/?pidx=${pidx}`;
        res.redirect(redirectUrl);
    } else {
        // Handle other statuses (e.g., Pending, Failed) or missing status
        res.status(400).send('Payment was not successful or invalid status received.');
    }
});


// Endpoint to handle form submission and store data in MongoDB
app.post('/submit-form', async (req, res) => {
    const { username, address, mobile, cartItems, amount } = req.body;

    try {
        const newOrder = new User({
            username,
            address,
            mobile,
            cartItems,
            amount,
        });

        await newOrder.save(); // Save user data to MongoDB
        res.status(201).send('User data saved successfully!');
    } catch (error) {
        res.status(400).send('Error saving user data: ' + error.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
