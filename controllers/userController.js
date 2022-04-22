const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const CustomeError = require('../utils/customError');
const mailHelper = require('../utils/emailhelper');
const crypto = require('crypto');


const signUp = BigPromise(async (req, res, next) => {
    //let result;
    if (!req.files) {
        return next(new CustomError("photo is required for signup ", 400));

    }
    const { name, email, password } = req.body;

    if (!(email && name && password)) {
        return next(new CustomError("name , email and password are require", 400));
    }

    let file = req.files.photo
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })

    const user = new User({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });
    await user.save();
    // const user = User.create({
    //     email,name,password
    // })
    //console.log('result :' + result);
    cookieToken(user, res);
});

const login = BigPromise(async (req, res, next) => {

    //checkinh for email and password
    const { email, password } = req.body
    if (!(email && password)) {
        return next(new CustomeError("please provide email and password", 400))
    }

    //getting user from data base
    const user = await User.findOne({ email }).select("+password");

    //if use not found in db
    if (!user) {
        return next(new CustomeError("you are not register in our database ", 400))
    }

    // match the password
    const isPasswordCorrect = await user.isvalidatedPassword(password);

    //matching password
    if (!isPasswordCorrect) {
        return next(new CustomeError("incorrect password ", 400));
    }

    //if all goes rigth send the token
    cookieToken(user, res);
});

const logout = BigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logout success",
    });
});

const forgotPassword = BigPromise(async (req, res, next) => {
    //collect email
    const { email } = req.body;

    //find user in database
    const user = await User.findOne({ email });

    //if user is not found
    if (!user) {
        return res.status(400).send('user not found');
    }

    //get token from the user model method
    const forgotToken = user.getForgotPasswordToken();

    //saveing the field of getforgotpasswordtoken in the database wihtout validating other changes in database
    await user.save({ validateBeforeSave: false })

    //exteranlly creating the url for reeset password
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    //message crafting for the email which will be send to user
    const message = `copy past this link in your url and hit the enter \n\n ${myUrl}`

    //finally sending the mail process
    try {
        await mailHelper({
            email: user.email,
            subject: "TshirtStore - Password reset email",
            message
        });
        res.status(200).json({
            success: true,
            message: "email send succesfully",
        })
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({ validateBeforeSave: false })

        return next(new CustomError(error.message, 500))
    }

});

const passwordReset = BigPromise(async (req, res, next) => {
    //getting forgot password token from url params
    const token = req.params.token;

    //we have stored the reset password token in encrypted formate but return simple token so tu remove the comparision overhead we have to encrypt
    const encrypToken = crypto.createHash('sha256').update(token).digest('hex');

    //finnding the user from database and coparetively checking that token is expire or not
    const user = await User.findOne({
        encrypToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        return next(new CustomError('Token is Expiered'));
    }

    //matching the password
    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError('both password should be match with each other'))
    }

    //seting the new password
    user.password = req.body.password;

    //removing the old token and expiry values
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    cookieToken(user, res);
});

const getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
});

const changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id

    const user = await User.findById(userId).select("+password");

    const isCorrectPassword = await user.isvalidatedPassword(req.body.oldpassword);
    if (!isCorrectPassword) {
        return next(new CustomError('old password is incorrect', 400))
    }
    user.password = req.body.password

    await user.save();

    cookieToken(user, res);

});

const updateUserDetails = BigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.files) {
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id;

        //delete the photo from cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        //update the photo into cloudinary
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        })

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

const adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

   
    const user = await User.findByIdAndUpdate(req.params.id,newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

const adminDeleteOneUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new CustomError('No such user found'),401)
    }
    const ImageId = user.photo.id;
    await cloudinary.v2.uploader.destroy(ImageId);
    await user.remove();

    res.status(200).json({
        success : true
    })
});

const adminAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success : true,
        users : users
    })

});

const adminGetOneUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new CustomError("No user found",400));
    }
    res.status(200).json({
        success : true,
        user : user
    });

});

const managerAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find({role: "user"});

    res.status(200).json({
        success : true,
        users : users
    })

});




module.exports = { signUp, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails ,adminAllUser ,managerAllUser,adminGetOneUser,adminUpdateOneUserDetails,adminDeleteOneUserDetails}