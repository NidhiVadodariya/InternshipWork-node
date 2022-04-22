const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planets.mongo');

// this are the planets where there is a posibilite to have life

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet["koi_insol"] < 1.11 && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve,reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        //fs.createReadStream('./src/models/kepler_data.csv')
    .pipe(parse({
        comment: '#', // rows that start with # cosidered as comment 
        columns: true // it create each row in the form of jason object
    }))
    .on('data', async (data) => {
        if(isHabitablePlanet(data)){
            savePlanet(data);
        }   

    })
    .on('error', (err) => {
        console.log(err);
        reject(err);
    })
    .on('end', async () => {
        const countPlanetFound = (await getAllPlanets()).length;
        console.log(`${countPlanetFound} habitable planets , found !!!`);
        resolve();
    });
    
    });    
}

async function getAllPlanets() {
    return await planets.find({});
}

async function savePlanet(planet){
    try {
        await planets.updateOne({
            kelplerName : planet.kepler_name,
        },{ 
            kelplerName : planet.kepler_name,
        },{
            upsert : true,
        });    
        
    } catch (error) {
        console.log(`could not save planet ${error}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};