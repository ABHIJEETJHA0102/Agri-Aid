const express = require("express");
const router = express.Router();
const list = require("../models/user");
const path = require("path"); // Import the path module

const { getAllList, delete_i, signUp, getByID, updateByID,getByUsername, addData ,login,getByDeviceId} = require("../controllers/userController");
router.route("/getAllItems").get(getAllList);
router.route("/getByID/:id").get(getByID);
router.route("/getByDeviceId/:deviceId").get(getByDeviceId);
router.route("/updateByID/:id").put(updateByID);
router.route("/getByUsername/:username").get(getByUsername);
router.route("/signUp/").post(signUp);
router.route("/login/").post(login);
router.route("/addData").post(addData);
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await list.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match, handle successful login
            // You can generate a token here for authentication
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Incorrect username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});
// Example server-side route handling for success pages with authentication
const isAuthenticated = require('../middleware/auth'); // Import middleware for authentication

// Route handler for success page 1
// router.get('/success1.html', isAuthenticated, (req, res) => {
//     // Only serve the success page if the user is authenticated
    
//     const htmlPath = path.join(__dirname, "../public","success1.html");
//         // Send the HTML file
//         res.sendFile(htmlPath);
// });

// Route handler for success page 2
router.get('/success2', isAuthenticated, (req, res) => {
    // Only serve the success page if the user is authenticated
    res.render('success2', { user: req.user }); // Render success2.ejs with user data
});

module.exports = router;

router.get("/login", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","login.html");
    res.sendFile(htmlPath);
});
router.get("/", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","index.html");
    res.sendFile(htmlPath);
});
router.get("/home", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","index.html");
    res.sendFile(htmlPath);
});
router.get("/speciesDetection", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","upload.html");
    res.sendFile(htmlPath);
});
router.get("/monitor", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","monitor.html");
    res.sendFile(htmlPath);
});

module.exports = router;