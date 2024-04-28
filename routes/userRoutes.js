const express = require("express");
const router = express.Router();
const list = require("../models/user");
const path = require("path"); // Import the path module

const { getAllList, delete_i, signUp, getByID, updateByID,getByUsername, addData ,login,getByDeviceId,loginPost} = require("../controllers/userController");
router.route("/getAllItems").get(getAllList);
router.route("/getByID/:id").get(getByID);
router.route("/getByDeviceId/:deviceId").get(getByDeviceId);
router.route("/updateByID/:id").put(updateByID);
router.route("/getByUsername/:username").get(getByUsername);
router.route("/signUp/").post(signUp);
router.route("/login/").post(login);
router.route("/addData").post(addData);
router.route('/login').post(loginPost);
// Example server-side route handling for success pages with authentication
const isAuthenticated = require('../middleware/auth'); // Import middleware for authentication
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
router.get("/home2", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","index2.html");
    res.sendFile(htmlPath);
});
router.get("/speciesDetection", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","upload.html");
    res.sendFile(htmlPath);
});
router.get("/monitor", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","plantMonitor.html");
    res.sendFile(htmlPath);
});

module.exports = router;