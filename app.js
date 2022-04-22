require('dotenv').config();
const express = require('express');
const app = express();

var morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//for swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

//regular middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp/", 
}));

//temp check
app.set("view engine","ejs");

//morgan middleware
app.use(morgan('tiny'))

//importing all the routes
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');
const order = require('./routes/order');


// router middleware
app.use('/api/v1',home);
app.use('/api/v1',user);
app.use('/api/v1',product);
app.use('/api/v1',order);

//signup test
app.get("/signuptest",(req,res) => {
    res.render("signuptest");
})

// export app js
module.exports = app;