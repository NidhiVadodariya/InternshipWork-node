const PORT = process.env.PORT || 8000
const http = require('http');
const app = require('./app')
const mongoose = require('mongoose');

const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchesData } = require('./models/launches.model');


const server = http.createServer(app);

const MONGO_URL = "mongodb+srv://nasa-api:NasaApi@cluster0.ducob.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connection.once('open', () => {
    console.error('MongoDB connection succesfull');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    console.log('hello');
    server.listen(PORT, () => {
        console.log('heelo1');
        console.log(`Listening on port ${PORT}...`);
    })
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }); 
    await loadPlanetsData();
    await loadLaunchesData();
}
startServer();






