const mongoose = require('mongoose');

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`DB connected succesfully`))
    .catch( error =>{
        console.log(`DB connection failed000`);
        console.log(error);
        process.exit(1)
    })
}