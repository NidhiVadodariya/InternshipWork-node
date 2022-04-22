const express = require('express');
//const User = require('../models/user');
// const bcrypt = require('bcryptjs');
const router = express.Router();
const {isLoggedIn,customRole} = require('../middleware/user')
const {register,login,test,logout,loginWithCode} = require('../controllers/userController');


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/login/EnterCodeHere/:codeVal").post(loginWithCode);
router.route("/logout").get(isLoggedIn,logout);

module.exports = router;