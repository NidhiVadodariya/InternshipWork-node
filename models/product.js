const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'please provide your name'],
        maxlength: [25, 'Name should be under 25 character'],
        unique : true
    },
    discription: {
        type: String,
        default : "nothing"
        // select: false
    },
    price :{
        type:Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    stock : {
        type : Number,
        required : true
    },
    user :{
        type : mongoose.Schema.ObjectId,
        ref : 'user',
        required : true
    },
    createdAt :{
        type : Date,
        default : Date.now,
    }
});
module.exports = mongoose.model('product',productSchema);