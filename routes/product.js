const express = require('express');
const router = express.Router();

const {isLoggedIn,customRole} = require('../middleware/user')
const {addProduct,
        getAllProduct,
        getOneProduct,
        UpdateOneProduct,
        DeleteOneProduct} = require('../controllers/productController');


router.route('/addproduct').post(isLoggedIn,customRole('admin'),addProduct);
router.route('/getAllproduct').get(isLoggedIn,getAllProduct);
router.route('/getOneProduct/:id').get(isLoggedIn,getOneProduct);
router.route('/UpdateOneProduct/:id').put(isLoggedIn,customRole('admin'),UpdateOneProduct);
router.route('/DeleteOneProduct/:id').delete(isLoggedIn,customRole('admin'),DeleteOneProduct);
router.route('/addtoCart/:id').post(isLoggedIn,DeleteOneProduct);

module.exports = router;