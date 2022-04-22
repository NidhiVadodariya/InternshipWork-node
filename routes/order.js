const express = require('express');
const router = express.Router();

const { isLoggedIn ,customRole } = require('../middleware/user');
const { createOrder } = require('../controllers/orderController');

router.route('/order/create').post(isLoggedIn,createOrder);




module.exports = router;