const list = require("../models/user");
const entry = require("../models/Entry");
const bcrypt = require('bcrypt');
const saltRounds = 8;

const getAllList = async(req, res) => {
    const myData = await list.find(req.query);
    res.status(200).json({myData});
};
const delete_i = async(req, res) => {
    try {
        await list.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

const getByID = async(req, res) => {
    try {
        const find_entry=await list.findById(req.params.id);
        res.status(200).json("Entry found:"+find_entry);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

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
// const signUp = async(req, res) => {
//     const { username, password, email } = req.body;
  
//     try {
//       // Hash the password
//       const hashedPassword = await new Promise((resolve, reject) => {
//         bcrypt.hash(password, saltRounds, (err, hash) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(hash);
//           }
//         });
//       });
  
//       // Create a new user with the hashed password
//       const newUser = new User({ username, password: hashedPassword, email });
  
//       // Save the user to the database
//       const savedUser = await newUser.save();
//       res.status(200).json("Saved User: " + savedUser);
//     } catch (err) {
//       res.status(400).json('Error: ' + err);
//     }
//   }
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


module.exports = {getAllList, delete_i, signUp, getByID, updateByID,getByUsername, addData,login};
