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
const { PythonShell } = require('python-shell');

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
        let result2;
        let result;
        await saveImageToFile(filePath, imageDataBuffer); // Wait for image to be saved successfully
        try {
            let options={
                scriptPath: "./scripts"
            }
            result = await PythonShell.run("predict.py", options);
            // console.log("iiiii");
            result=result[result.length-1];
            console.log(result);
            let in1="Provide treatment and prevention measure for this disease:"+result;
            let options2={
                scriptPath: "./scripts/chatbot",
                args:[in1]
            }
            result2 = await PythonShell.run("model2.py", options2);
            console.log(result2);
            result2 = result2.map(str => str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b> '));
            console.log(result2);
            result2=result2.join("<br>")
            // await getAns(req.body, res);
          } catch (err) {
            console.error(err);
            res.status(500).json()
          }
        // Proceed with spawning the child process for the Python script
        // const pythonProcess = spawn('python', ["./routes/predict.py","main2"]);
        // console.log("pythonprocess");

        // let predictionResult;
        // const predictionPromise = new Promise((resolve, reject) => {
        //     let predictionResult = '';
        
        //     pythonProcess.stdout.on('data', (data) => {
        //         predictionResult += data.toString();
        //         // console.log(predictionResult);
        //     });
            
        //     pythonProcess.stdout.on('end', () => {
        //         try {
        //             console.log("got here",predictionResult);
        //             predictionResult = predictionResult.trim().split(' ').pop();
        //             console.log("Prediction:",predictionResult);
        //             resolve(predictionResult);
        //         } catch (error) {
        //             reject(new Error('Error parsing prediction output: ' + error.message));
        //         }
        //     });
        
        //     pythonProcess.on('error', (error) => {
        //         reject(new Error('Error executing Python script: ' + error.message));
        //     });
        // });
        // console.log(predictionResult);
        result="Prediction: <b>"+result+"</b>";
        res.status(200).json({prediction:result,message:result2});
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: error.message });
    }
};

router.post('/upload', upload.single('uploaded_file'), async (req, res)=>{
    console.log("got image");
    const imageDataBuffer = Buffer.from(req.file.buffer.toString('base64'), 'base64');
    const filePath = '../image.jpg'; // Change the extension according to your image format
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
router.post('/suggest',async (req,res)=>{
    console.log(req.body);
    let in1=(`${req.body.species} ${req.body.temperature} ${req.body.pH} ${req.body.N} ${req.body.P} ${req.body.K} ${req.body.moisture}`);
    // let options={
    //     scriptPath: "./routes",
    //     args:[in1]
    // }
    console.log("kkkk");
    // PythonShell.run("recom2.py",options,(err,res)=>{
    //     console.log("iiiiii");
    //     if(err)console.log(err);
    //     if(res)console.log(res);
    // });
    try {
        // const result = await PythonShell.run("recom2.py", options);
        // console.log("iiiii");
        // const result2=result.join("\n")
        // console.log(result2);
        let options2={
            scriptPath: "./scripts/chatbot",
            args:[in1]
        }
        let result3 = await PythonShell.run("model.py", options2);
        console.log(result3);
        result3 = result3.map(str => str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b> '));
        console.log(result3);
        result3=result3.join("<br>")
        res.status(200).json(result3);
        // await getAns(req.body, res);
      } catch (err) {
        console.error(err);
        res.status(500).json()
      }
    // await getAns(req.body,res);

})
router.post('/chat',async (req,res)=>{
    console.log(req.body.message);
    console.log("kkkk");
    try {
        let in1=req.body.message;
        let options={
            scriptPath: "./scripts/chatbot",
            args:[in1]
        }
        let result = await PythonShell.run("model2.py", options);
        // console.log("iiiii");
        console.log(result);
        result = result.map(str => str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b> '));
        console.log(result);
        result=result.join("<br>")
        res.status(200).json(result);
        // await getAns(req.body, res);
      } catch (err) {
        console.error(err);
        res.status(500).json()
      }
    // await getAns(req.body,res);

})
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
router.get("/profile", (req, res) => {
    const htmlPath = path.join(__dirname, "../public","profile.html");
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
router.get("/chatbot", (req, res) => {
    const htmlPath = path.join(__dirname, "../public/chatbot","ChatBox.jsx");
    res.render(htmlPath);
});
router.get('/voice-input', async(req, res) => {
    const transcript = req.query.transcript;
    console.log('Received transcript:', transcript);
    if(transcript){
        try {
            let in1=transcript;
            let options={
                scriptPath: "./routes/chatbot",
                args:[in1]
            }
            let result = await PythonShell.run("model.py", options);
            // console.log("iiiii");
            console.log(result);
            result = result.map(str => str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b> '));
            console.log(result);
            result=result.join("<br>")
            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
    }

    // Process the transcript here, e.g., store it in a database, send it to a speech-to-text service, etc.
    return res.json({ message: 'Transcript received successfully' });
})


module.exports = router;