const path = require("path"); // Import the path module

const loginPage=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","login.html");
    res.sendFile(htmlPath);
};
const profile=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","profile.html");
    res.sendFile(htmlPath);
};
const index=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","index.html");
    res.sendFile(htmlPath);
};
const index2=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","index2.html");
    res.sendFile(htmlPath);
};
const uploadPage=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","upload.html");
    res.sendFile(htmlPath);
};
const plantMonitor=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public","plantmonitor.html");
    res.sendFile(htmlPath);
};
const chatBox=async(req,res)=>{
    const htmlPath = path.join(__dirname, "../public/chatbot","ChatBox.jsx");
    res.render(htmlPath);
};
module.exports={ loginPage, profile,index, index2,uploadPage,plantMonitor,chatBox};