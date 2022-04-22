const express = require('express');
const router = express.Router();

const { isLoggedIn ,customRole } = require('../middleware/user');
const { testproduct,
    addProduct,
    getAllProduct,
    adminGetAllProduct,
    getOneProduct,
    adminUpdateOneProduct,
    adminDeleteOneProduct,
    addReview,
    deleteReview,
    getOnlyReviewforOneProduct} = require('../controllers/productController');

router.route('/testproduct').get(testproduct);

//user router
router.route('/products').get(getAllProduct);
router.route('/product/:id').get(getOneProduct);
router.route('/review').put(isLoggedIn,addReview);
router.route('/review').delete(isLoggedIn,deleteReview);
router.route('/review').get(isLoggedIn,getOnlyReviewforOneProduct);

//admin routes
router.route('/admin/product/add').post(isLoggedIn,customRole('admin'),addProduct);
router.route('/admin/products').get(isLoggedIn,customRole('admin'),adminGetAllProduct );
router.route('/admin/UpdateProduct/:id').put(isLoggedIn,customRole('admin'),adminUpdateOneProduct );
router.route('/admin/removeProduct/:id').delete(isLoggedIn,customRole('admin'),adminDeleteOneProduct );

module.exports = router;