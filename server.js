const express = require('express');
const cors = require('cors')

const app = express()

var corOptions = {
    origin : "https://localhoast:8081"
}
//middleware
app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))


//testing route
app.get('/',(req,res) => {
    res.json({
        message : "hello from api"
    })
})

//router
const router = require('./routes/productRoutes')
app.use('/api/products',router)


//port
const PORT = process.env.PORT || 8080

//server
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})