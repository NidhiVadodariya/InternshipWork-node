const User = require('../models/user');
const Product = require('../models/product')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomError = require('../utils/customError');
const BigPromise = require('../middleware/bigPromise')


exports.addToCart = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw CustomError('this product is not in the data base', 401)
    }
    const data ={
        productId: req.params.id,
        quantity: req.params.quantity
    }

    const Alreadyadded = req.user.cart.find(
        (ele) => ele.productId.toString() === req.params.id.toString()
    )
    if (Alreadyadded) {
        Alreadyadded.quantity += parseInt(req.params.quantity)
    } else {
        req.user.cart.push(data)
    }
    req.user.cartTotal += product.price * parseInt(req.params.quantity)
    const resultOfProduct = await Product.findByIdAndUpdate(req.params.id, {
            stock: product.stock - parseInt(req.params.quantity)
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
    
    if (!resultOfProduct) {
        throw CustomError('Something wrong', 401)
    }

    await req.user.save({validateBeforeSave : false})

    res.status(200).json({
        success: true,
        message: "product is add to cart"
    });
});

exports.removeFromCart = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw CustomError('this product is not in the data base', 401)
    }
    
    const data = req.user.cart.find(
        (ele) => ele.productId.toString() === req.params.id.toString())
    
    if(!data){
        throw CustomError('product is not in the cart', 401)
    }
    if((data.quantity - parseInt(req.params.quantity))<0){
        throw CustomError('given quantity of product is not in the cart please check you cart', 401)
    }
    data.quantity -= parseInt(req.params.quantity)
    req.user.cartTotal -= product.price * parseInt(req.params.quantity)
    if(data.quantity == 0){
        data.remove()
    }

    const resultOfProduct = await Product.findByIdAndUpdate(req.params.id, {
        stock: product.stock - parseInt(req.params.quantity)
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

if (!resultOfProduct) {
    throw CustomError('Something wrong', 401)
}
    await req.user.save({validateBeforeSave : false})
    res.status(200).json({
        success: true,
        message: "product is removed from cart"
    });
});

exports.displayCart = BigPromise(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        Cart : req.user.cart,
        CartTotalAmount : req.user.cartTotal,
    });
});
