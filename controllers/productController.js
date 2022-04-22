const User = require('../models/user');
const Product = require('../models/product')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomError = require('../utils/customError');
const BigPromise = require('../middleware/bigPromise')

exports.addProduct = BigPromise(async (req, res, next) => {
    const { name, price, stock, quantity } = req.body;
    if (!(name, price, stock, quantity)) {
        throw new CustomError('All fields are required', 401);
    }
    let result = await Product.findOne({ name: name })
    if (result) {
        const product = await Product.findByIdAndUpdate(result._id,{stock:result.stock+quantity}, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            product,
        });
    }
    else {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(200).json({
            success: true,
            product,
        });
    }
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
    const data = await Product.find();
    console.log(data);
    res.status(200).json({
        success: true,
        data,
    });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
    const data = await Product.findById(req.params.id);
    console.log(data);
    res.status(200).json({
        success: true,
        data,
    });
});

exports.UpdateOneProduct = BigPromise(async (req, res, next) => {
    const data = await Product.findById(req.params.id);
    if (!data) {
        throw CustomError('this product is not in the data base', 401)
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product,
    });
});

exports.DeleteOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw CustomError('this product is not in the data base', 401)
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "product is deleted"
    });
});

