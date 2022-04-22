const BigPromise = require('../middleware/bigPromise')
const Product = require('../models/product');
const cloudinary = require('cloudinary');
const CustomeError = require('../utils/customError');
const WhereClause = require("../utils/whereClause");



exports.testproduct = BigPromise(async (req, res, next) => {
    res.status(200).json({
        success: true,
        greeting: "testing of product module"
    });
});

exports.addProduct = BigPromise(async (req, res, next) => {
    console.log(req);

    //handling multiple images
    let imageArray = [];

    if (!req.files) {
        return next(new CustomeError('images are required', 401));
    }
console.log(req.files);
    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,
                {
                    folder: "products",
                }
            );
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            })
        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product,
    });

});

exports.getAllProduct = BigPromise(async (req, res, next) => {

    const resultperPage = 5
    const totalcountProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base.clone();
    const filteredProductNumber = products.length;

    productsObj.pager(resultperPage);
    products = await productsObj.base;


    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        totalcountProduct
    });
});

exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });

});

exports.getOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomeError('No product found with this id', 401))
    }

    res.status(200).json({
        success: true,
        product,
    });

});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {

    //getting error in this portion becuase when you send one file it will come as an object so .legth method doesn't work perfectlu but when you send multiple file it will goes as an array
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomeError('No product found with this id', 401))
    }
    let imageArray = [];
    console.log(req.files);
    if (req.files) {

        for (let index = 0; index < product.photos.length; index++) {
            const result = await cloudinary.v2.uploader.destroy(product.photos[index].id)

        }
        console.log(req.files.photos.length);
        for (let index = 0; index < req.files.photos.length; index++) {
            let ans = await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,
                {
                    folder: "products",
                }
            );
            console.log(ans);
            imageArray.push({
                id : ans.public_id,
                secure_url : ans.secure_url,
            })
        }

    }

    req.body.photos = imageArray;
    //console.log(req.body.photos);
    product = await Product.findByIdAndUpdate(req.params.id,req.body.photos,{
        new:true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product,
    });
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomeError('No product found with this id', 401))
    }

    for (let index = 0; index < product.photos.length; index++) {
        const result = await cloudinary.v2.uploader.destroy(product.photos[index].id)

    }

    await product.remove();
    res.status(200).json({
        success: true,
        message: "product is deleted"
    });

});

exports.addReview = BigPromise(async (req, res, next) => {
    const {rating, comment , productId} = req.body

    const review ={
        user: req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    console.log(product);
    const AlreadyReview = product.reviwes.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (AlreadyReview) {
        product.reviwes.forEach((review) => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            }
        });
    } else {
        product.reviwes.push(review);
        product.numberOfReviwes = product.reviwes.length
    }

    //adjust all over rating
    product.ratings = product.reviwes.reduce((acc,item) => item.rating + acc , 0)/product.reviwes.length

    await product.save({validateBeforeSave : false})

    res.status(200).json({
        success: true,
    });





});

exports.deleteReview = BigPromise(async (req, res, next) => {
    const {productId} = req.query;

    const product = await Product.findById(productId);

    const reviwes = product.reviwes.filter(
        (rev) => rev.user.toString() === req.user._id.toString())

    numberOfReviwes = product.reviwes.length

    //adjust all over rating
    product.ratings = product.reviwes.reduce((acc,item) => item.rating + acc , 0)/product.reviwes.length

    //update the product
    await Product.findByIdAndUpdate(productId,{
        reviwes,
        ratings,
        numberOfReviwes
    },{ 
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success: true,
    });
});

exports.getOnlyReviewforOneProduct = BigPromise(async (req, res, next) => {
   const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviwes : product.reviwes
    });
});


