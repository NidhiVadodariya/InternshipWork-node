require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = require('./app');

app.listen(process.env.PORT, () =>{
    console.log(`server is running at port number : ${process.env.PORT}`);
});