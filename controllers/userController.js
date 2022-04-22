const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/customError');
const mailHelper = require('../utils/emailhelper');

exports.register = async (req, res) => {
    try {
        const { email, password, cpassword } = req.body;

        if (!(email && password && cpassword)) {
            throw new CustomError('All fields are required', 401);


        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new CustomError('already resgistered user', 401);


        }

        if (password !== cpassword) {
            throw new CustomError('Password missmatched !!!', 401);


        }
        else {
            const EncPassword = await bcrypt.hash(password, 5);

            const user = await User.create({
                email,
                password: EncPassword
            });
            cookieToken(user, res);
        }
    }
    catch (error) {
        res.send(error.message)
    }
}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    if (!(email && password)) {
        throw new CustomError('All fields are required', 401);
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError('user not fount in db', 401);
    }

    const isPasswordCorrect = await user.isvalidatedPassword(password);

    if (!isPasswordCorrect) {
        throw new CustomError('incorrect password', 401);
    }

    const smsCode = await user.getsmsCode();
    console.log(smsCode);
    await user.save({ validateBeforeSave: false });

    const myURL = `${req.protocol}://${req.get("host")}/api/v1/login/EnterCodeHere/`

    const message = `copy past this link in your url and write the otp code  ${smsCode} which you have got throgh this mail and hit the enter \n\n ${myURL}`

    try {
        await mailHelper({
            email: user.email,
            subject: "NidhiVadodariya- FirstProject",
            message
        });
        res.status(200).json({
            success: true,
            message: "email send succesfully",
        })
    } catch (error) {
        await user.save({ validateBeforeSave: false });
        user.smsCode = undefined;
        user.smsCodeExpiry = undefined;
        res.send(error.message);
    
    }
    //if all goes rigth send the token   
}

exports.loginWithCode = async (req, res) => {

    try {
        const code = parseInt(req.params.codeVal);
        console.log(code);
        const user = await User.findOne({
            smsCode:code,
            smsCodeExpiry: { $gt: Date.now() }
        })
        console.log(user);

        if (!user) {
            throw new CustomError('Code is invalid or may be expired', 404);
        }

        user.smsCode = undefined;
        user.smsCodeExpiry = undefined;

        await user.save({ validateBeforeSave: false });
        cookieToken(user, res);
    } catch (error) {
        res.send(error.message);
    }
    //if all goes rigth send the token   
}



exports.logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logout success",
    })
}