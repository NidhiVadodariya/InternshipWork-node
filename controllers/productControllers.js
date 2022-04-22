const db = require('../models')

const Product = db.products
const Review = db.reviews

const addProduct = async (req,res) => {
    let data = {
        title : req.body.title,
        price : req.body.price,
        description : req.body.description,
        published : req.body.published
    } 

    const product = await Product.create(data)

    res.status(200).json({
        product : product
    })
}

const getAllProducts = async (req,res) => {
    let products = await Product.findAll({
        attributes : [ 'title' ,'price']
    })
    res.status(200).send(products)
}

const getSingleProduct = async (req,res) => {
    let id = req.params.id
    let product = await Product.findOne({ where : {id : id}})
    res.status(200).send(product)
}

const updateProduct = async (req,res) => {
    let id = req.params.id
    let product = await Product.update(req.body,{ where : {id : id}})
    res.status(200).send(product)
}


const deleteProduct = async (req,res) => {
    let id = req.params.id
    await Product.destroy({ where : {id : id}})
    res.status(200).send("product is deleted")
}


const getPublishedProduct = async (req,res) => {
    let product = await Product.findAll({where : {published : true}})
    res.status(200).send(product)
}

module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getPublishedProduct
}