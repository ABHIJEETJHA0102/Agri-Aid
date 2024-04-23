const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000; // You can change this port as needed
const cors = require('cors');


app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://abhijeetjha0809:yTExEz1s76KdJxXL@krackhack.ghedcnr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose schema for the user data
const userSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  club: String,
  position: String,
  email: String,
  password: String,
});

// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

// Set up middleware to parse JSON requests
app.use(express.json());

// Handle signup requests
app.post('/signup', async (req, res) => {
  try {
    // Create a new user instance
    const newUser = new User(req.body);

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'User signed up successfully!' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Error signing up user.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
