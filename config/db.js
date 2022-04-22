const mongoose = require('mongoose');

const connectWithDB = () => {
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
.then(console.log(`DB connected succesfully`))
.catch((error) =>{
    console.log(`Issues in connection of DB`);
    console.log(error);
    process.exit(1);
});
}; 

 module.exports = connectWithDB;