const express = require('express');
const router = express.Router();

const {isLoggedIn,customRole} = require('../middleware/user');
const {addToCart,removeFromCart,displayCart} = require('../controllers/cartController');

router.route('/addToCart/:id/:quantity').post(isLoggedIn,addToCart);
router.route('/removeFromCart/:id/:quantity').post(isLoggedIn,removeFromCart);
router.route('/displayCartData').get(isLoggedIn,displayCart);

module.exports = router;