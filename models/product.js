const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide product name'],
        trim: true,
        maxlength: [120, 'product name should not be more tyhan 120 characters']
    },
    price: {
        type: Number,
        required: [true, 'please provide product price'],
        maxlength: [5, 'product price should not be greater than 5 digit']
    },
    description : {
        type: String,
        required: [true,'please provide product description'],
    },
    photos :[
        {
            id:{
                type : String,
                required :  true
            },
            secure_url :{
                type : String,
                required : true
            }
        }
    ],
    category: {
        type: String,
        required: [true,'please select category'],
        enum:{
            values : [
                'shortsleeves',
                'longsleeves',
                'sweatshirt',
                'hoodies'
            ],
            message : 'please select category from given',
        },
        
    },
    brand : {
        type: String,
        required: [true,'please provide product brand name'],
    },
    ratings : {
        type: Number,
        default : 0
    },
    numberOfReviwes:{
        type : Number,
        default:0
    },
    reviwes : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : 'User',
                required:true
            },
            name :{
                type :String,
                required : true,
            },
            rating : {
                type : Number,
                required : true,
            },
            comment : {
                type : String,
                required : true,
            }
        }
    ],
    user :{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt :{
        type : Date,
        default : Date.now,
    }
});

module.exports = mongoose.model('Product', productSchema)