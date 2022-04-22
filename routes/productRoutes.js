const productController = require('../controllers/productControllers');

const router = require('express').Router();

router.post('/addProduct',productController.addProduct)
router.get('/getAllProducts',productController.getAllProducts)
router.get('/getPublishedProducts',productController.getPublishedProduct)
router.get('/getOneProduct/:id',productController.getSingleProduct)
router.put('/updateProduct/:id',productController.updateProduct)
router.delete('/deleteProduct/:id',productController.deleteProduct)

module.exports = router