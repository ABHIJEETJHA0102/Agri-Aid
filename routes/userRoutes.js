const express = require("express");
const router = express.Router();

const { signUp, updateByID,getByUsername, addData,login,getByDeviceId,loginPost,suggestFunc,chat,voice_input,uploadFunc} = require("../controllers/userController");
const { loginPage, profile,index, index2,uploadPage,plantMonitor,chatBox} = require("../controllers/webPageController");

//operation routers
router.route("/getByDeviceId/:deviceId").get(getByDeviceId);
router.route("/updateByID/:id").put(updateByID);
router.route("/getByUsername/:username").get(getByUsername);
router.route("/voice-input").get(voice_input);
router.route("/signUp/").post(signUp);
router.route("/login/").post(login);
router.route("/addData").post(addData);
router.route('/login').post(loginPost);
router.route('/suggest').post(suggestFunc);
router.route('/chat').post(chat);
router.route('/upload').post(uploadFunc);

//Web pages routers
router.route('/login').get(loginPage);
router.route('/profile').get(profile);
router.route('/').get(index);
router.route('/home').get(index);
router.route('/home2').get(index2);
router.route('/speciesDetection').get(uploadPage);
router.route('/monitor').get(plantMonitor);
router.route('/chatbot').get(chatBox);

module.exports = router;