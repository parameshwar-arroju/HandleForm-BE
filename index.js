// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB (replace 'mongodb://localhost/mydatabase' with your MongoDB connection string)
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB schema
const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    name: String,
    email: String,
    message: String,
    submitDate: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// Middleware to enable CORS
app.use(cors());
app.use(express.json());

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Create a new contact instance
        const newContact = new Contact({ name, email, message });
        // Save the contact instance to MongoDB
        await newContact.save();
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
