require('dotenv').config();
const express = require('express');
require("./config/database").connect();
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//impoerting all thr routes
const user = require('./routes/user');
const product = require('./routes/product');
const cart = require('./routes/cart');


app.use('/api/v1',user);
app.use('/api/v1',product);
app.use('/api/v1',cart);
app.use((err,req,res,next)=>{
    if(err){
        console.log(err.message);
        res.send(err.message);
    } 
    next()
})

module.exports = app;