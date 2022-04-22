const Order = require('../models/order')
const Product = require('../models/product');
const BigPromise = require('../middleware/bigPromise')


exports.createOrder= BigPromise(async(req,res,next) =>{
    req.body.user = req.user.id;
    const { shippingInfo,
        user,
        orderItems,
        paymentInfo,
        taxAmount,
        shoppingAmount,
        totalAmount} = req.body;
        console.log(req.body);
        const order = await Order.create({
            shippingInfo,
            user,
                orderItems,
                paymentInfo,
                taxAmount,
                shoppingAmount,
                totalAmount,
        });
        console.log(order);
        res.status(200).json({
            success : true,
            order
        })
});

