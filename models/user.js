const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide your name'],
        maxlength: [40, 'Name should be under 40 character'],
        minlength: [3, 'Name should be under 40 character']
    },
    email: {
        type: String,
        required: [true, 'please provide your email'],
        validate: [validator.isEmail, 'please enter in correct format'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please provide your password'],
        minlength: [6, 'password should be atleast 6 character'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo : {
        id : {
            type : String,
            required : true
        },
        secure_url : {
            type : String,
            required : true
        }
    },
    forgotPasswordToken : {type:String},
    forgotPasswordExpiry : {type:Date},
    createdAt : {
        type : Date, 
        default:Date.now()
    }

});

//encrypt password before save -- pre is hook
userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

//validate the password with passed on user password
userSchema.methods.isvalidatedPassword = async function(usersendPassword){
    return await bcrypt.compare(usersendPassword,this.password)
};

//method for creaytevand return jwt token
userSchema.methods.getJwtToken = async function(){
    return await jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY,
    });
};

//generate forgot password token(string)
userSchema.methods.getForgotPasswordToken = function(){
    const forgotToken = crypto.randomBytes(20).toString('hex');

    //this value stores in data base but we are returning simple forgottoken so make sure white comparing both
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    //time of token
    this.forgotPasswordExpiry = Date.now() + 20*60*1000

    return forgotToken
}

const User = mongoose.model('User', userSchema)

module.exports = User;