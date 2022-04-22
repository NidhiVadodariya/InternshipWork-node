const BigPromise = require('../middleware/bigPromise')

const stripe = require('stripe')(process.env.STRIPE_SECRET)
exports.sendStripKey = BigPromise(async(req,res) =>{
    res.status(200).json({
        stripkey: process.env.STRIPE_API_KEY
    });
});

exports.captureStripePayment = BigPromise(async(req,res) =>{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount:req.body.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        
      });
    
      res.status(200).json({
          sucsess : true,
          client_secret : session.client_secret, 
      });
});

exports.sendRazorpayKey = BigPromise(async(req,res) =>{
    res.status(200).json({
        stripkey: process.env.RAZORPAY_API_KEY
    });
});

exports.captureRazorpayPayment = BigPromise(async(req,res) =>{
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY , key_secret: process.env.RAZORPAY_SECRET })
    const myOrder = await instance.orders.create({  amount:req.body.amount,  currency: "INR"})
      res.status(200).json({
          sucsess : true,
          amount : req.body.amount,
          client_secret : session.client_secret,
          order : myOrder 
      });
});