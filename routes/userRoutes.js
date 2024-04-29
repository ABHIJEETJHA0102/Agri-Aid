const express = require("express");
const router = express.Router();
const list = require("../models/user");
const path = require("path"); // Import the path module
const multer  = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ dest: './public/data/uploads/' });
const { spawn } = require('child_process');
const fs = require('fs');

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

const saveAndProcessImage = async (filePath, imageDataBuffer, res) => {
    try {
        await saveImageToFile(filePath, imageDataBuffer); // Wait for image to be saved successfully

        // Proceed with spawning the child process for the Python script
        const pythonProcess = spawn('python', ["./routes/predict.py","main2"]);
        console.log("pythonprocess");

        let predictionResult;
        const predictionPromise = new Promise((resolve, reject) => {
            let predictionResult = '';
        
            pythonProcess.stdout.on('data', (data) => {
                predictionResult += data.toString();
                // console.log(predictionResult);
            });
            
            pythonProcess.stdout.on('end', () => {
                try {
                    console.log("got here",predictionResult);
                    predictionResult = predictionResult.trim().split(' ').pop();
                    // console.log(numbersAfterLastSpace);
                    resolve(predictionResult);
                } catch (error) {
                    reject(new Error('Error parsing prediction output: ' + error.message));
                }
            });
        
            pythonProcess.on('error', (error) => {
                reject(new Error('Error executing Python script: ' + error.message));
            });
        });
        // console.log(predictionResult);
        predictionResult = await predictionPromise;
        res.status(200).json(predictionResult);
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: error.message });
    }
};

router.post('/upload', upload.single('uploaded_file'), async (req, res)=>{
    const imageDataBuffer = Buffer.from(req.file.buffer.toString('base64'), 'base64');
    const filePath = './image.jpg'; // Change the extension according to your image format
    await saveAndProcessImage(filePath, imageDataBuffer, res);
});
const saveImageToFile = async (filePath, imageDataBuffer) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, imageDataBuffer, (err) => {
            if (err) {
                console.error('Error saving image:', err);
                reject(err);
            } else {
                console.log('Image saved successfully.');
                resolve();
            }
        });
    });
};
// Example server-side route handling for success pages with authentication
const isAuthenticated = require('../middleware/auth'); // Import middleware for authentication
const { type } = require("os");
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