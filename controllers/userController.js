const list = require("../models/user");
const entry = require("../models/Entry");
const bcrypt = require('bcrypt');
const Entry = require("../models/Entry");
const { PythonShell } = require('python-shell');
const saltRounds = 8;
const multer  = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const fs = require('fs');

const suggestFunc=async(req,res)=>{
    console.log(req.body);
    let in1=(`${req.body.species} ${req.body.temperature} ${req.body.pH} ${req.body.N} ${req.body.P} ${req.body.K} ${req.body.moisture}`);
    try {
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
};
const chat=async(req,res)=>{
    console.log(req.body.message);
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
};
const voice_input=async(req,res)=>{
    const transcript = req.query.transcript;
    console.log('Received transcript:', transcript);
    if(transcript){
        try {
            let in1=transcript;
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
            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
    }

    // Process the transcript here, e.g., store it in a database, send it to a speech-to-text service, etc.
    return res.json({ message: 'Transcript received successfully' });
};
const getByDeviceId = async (req, res) => {
    try {
        const find_entries = await entry.find({ deviceId: req.params.deviceId });
        if (find_entries.length > 0) {
            res.status(200).json(find_entries);
        } else {
            res.status(404).json("No entries found for deviceId: " + req.params.deviceId);
        }
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};
const loginPost=async(req,res)=>{
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
}
const signUp = async(req, res) => {
    const { password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the hashed password
  const newListEntry = new list({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
    try {
        const savedListEntry = await newListEntry.save();
        res.status(200).json("Saved List Entry:"+ savedListEntry);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};
const addData = async(req, res) => {
    const newEntry = new entry(req.body);
    try {
        const savedEntry = await newEntry.save();
        res.status(200).json("Saved Entry:"+ savedEntry);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

const updateByID = async(req, res) => {
    try {
        const updatedListEntry = await list.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json("Updated List Entry:" + updatedListEntry);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

const getByUsername = async (req, res) => {
    try {
        const user = await list.find({ username: req.params.username });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};
const login=async(req,res)=>{
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
}

//plant species prediction ===================================x==============x===========================
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
            console.log("iiiii");
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
        result="Prediction: <b>"+result+"</b>";
        res.status(200).json({prediction:result,message:result2});
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: error.message });
    }
};
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
const uploadFunc = async (req, res) => {
    // Call the upload middleware directly
    upload.single('uploaded_file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send('Error uploading file');
        }
        
        console.log("got image");
        
        // Ensure req.file is defined
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const imageDataBuffer = Buffer.from(req.file.buffer.toString('base64'), 'base64');
        const filePath = '../image.jpg'; // Change the extension according to your image format
        
        await saveAndProcessImage(filePath, imageDataBuffer, res);
    });
};
// const uploadFunc = async (req, res) => {
//     // Call the upload middleware directly
//     upload.single('uploaded_file')(req, res, async (err) => {
//         if (err) {
//             return res.status(400).send('Error uploading file');
//         }
        
//         console.log("got image");
        
//         // Ensure req.file is defined
//         if (!req.file) {
//             return res.status(400).send('No file uploaded');
//         }

//         const imageDataBuffer =req.file.buffer.toString('base64');
//         console.log(imageDataBuffer);
//         let result2;
//         let result;
//         // await saveImageToFile(filePath, imageDataBuffer); // Wait for image to be saved successfully
//         try {
//             let options={
//                 scriptPath: "./scripts",
//                 args:[imageDataBuffer]
//             }
//             result = await PythonShell.run("predict.py", options);
//             // console.log("iiiii");
//             result=result[result.length-1];
//             console.log(result);
//             let in1="Provide treatment and prevention measure for this disease:"+result;
//             let options2={
//                 scriptPath: "./scripts/chatbot",
//                 args:[in1]
//             }
//             result2 = await PythonShell.run("model2.py", options2);
//             console.log(result2);
//             result2 = result2.map(str => str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b> '));
//             console.log(result2);
//             result2=result2.join("<br>")
//             // await getAns(req.body, res);
//           } catch (err) {
//             console.error(err);
//             res.status(500).json()
//           }
//         result="Prediction: <b>"+result+"</b>";
//         res.status(200).json({prediction:result,message:result2});
//         // const filePath = '../image.jpg'; // Change the extension according to your image format
        
//         // await saveAndProcessImage(filePath, imageDataBuffer, res);

//     });
// };
module.exports = {signUp, updateByID,getByUsername, addData,login,getByDeviceId,loginPost,suggestFunc,chat,voice_input,uploadFunc};