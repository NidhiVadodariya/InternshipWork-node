const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required: [true, 'please provide your name'],
        maxlength: [25, 'Name should be under 25 character'],
        unique : true
    },
    password: {
        type: String,
        required: [true, 'please provide your password'],
        minlength: [6, 'password should be atleast 6 character'],
        // select: false
    },
    role :{
        type:String,
        default: 'user'
    },
    smsCode : {
        type:Number,
        default:null
    },
    smsCodeExpiry : {
        type:Date,
        default: Date.now
    },
    cart :[
        {
            productId : {
                type : mongoose.Schema.ObjectId,
                ref : 'product',    
            },
            quantity : {
                type : Number,
                default : 0     
            }
        }
    ],
    cartTotal : {
        type: Number,
        default : 0
    },
    createdAt : {
        type : Date, 
        default:Date.now
    }
    
});

userSchema.methods.isvalidatedPassword = async function(usersendPassword){
    return await bcrypt.compare(usersendPassword,this.password)
};

userSchema.methods.getJwtToken = async function(){
    return await jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY,
    });
};

userSchema.methods.getsmsCode = function(){
    const dummyToken = Math.floor((Math.random() * 10000) + 1);
    this.smsCode = dummyToken;
    this.smsCodeExpiry = Date.now() + 20*60*60
    return dummyToken
}
module.exports = mongoose.model('user',userSchema);


