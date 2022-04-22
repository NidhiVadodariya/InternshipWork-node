const axios = require('axios');
const instance = axios.create();
const launches = new Map();
const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo');
let DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches( ) {
    console.log('Downloading launch data...');
    try {
        const response =  await axios.post(SPACEX_API_URL,{
            query : {},
            options : {
                pagination : false, 
                populate : [
                    {
                        path : 'rocket',
                        select : {
                            name : 1
                        }
                    },
                    {
                        path : 'payloads',
                        select : {
                            customers : 1
                        }
                    }
                ]
            }
        });

        if (response.status !== 200) {
            console.log('problem in downloading launch data');
            throw new Error('launch dataa download fail')
        }


        const launchDocs = response.data.docs;
        console.log(launchDocs);
        for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers']; 
        })
        
        const launch = {
            flightNumber : launchDoc['flight_number'],
            mission : launchDoc['name'],
            rocket : launchDoc['rocket']['name'],
            launchDate : launchDoc['date_local'],
            upcoming : launchDoc['upcoming'],
            success : launchDoc['success'],
            customers,
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunch(launch)
    }
    } catch (error) {
        console.log('error occured');
    }
}


async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber : 1,
        rocket : 'Falcon 1',
        mission : 'FalconSat',    
    });
    if (firstLaunch) {
        console.log('launch data already loaded');
        return;
    }
    else{
        await populateLaunches();
    }
    
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}


async function getAlllaunches(skip,limit) {
    return await launchesDatabase.find({},{})
        .sort({ flightNumber : 1})
        .skip(skip)
        .limit(limit); //this extra {} shows while showing fetched data mongoose don't display version key and objectID
}

async function saveLaunch(launch){
    const data = await launchesDatabase.updateOne({
            flightNumber : launch.flightNumber,
        }, launch , {
            upsert : true,
        });
        return data
        
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        kelplerName : launch.target
    });
    console.log(planet);
    if(!planet) {
        console.log('planet not exist');
        throw new Error('no matching planet found')
    }




    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch , {
        success : true,
        upcoming : true,
        customer : ['Zeor to Mastery','NASA'],
        flightNumber : newFlightNumber,
    });
    console.log("newlaunch" ,newLaunch);
    const data = await saveLaunch(newLaunch)
    return data
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber :launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber : launchId
    },{
        upcoming : false ,
        success : false,
    });
    return aborted.ok === 1 && aborted.nModified === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted
}

module.exports = {
    getAlllaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchesData,
}

//mapping of spacex dataendpoint with our values

// const launch = {
//     flightNumber : 100,  #flight_number
//     mission : 'kepler Exploration X', #name
//     rocket : 'Explorer IS1', #rocket.name
//     launchDate : new Date('December 27, 2030'), #date_local
//     target : 'kepler-442 b', #not applicable
//     customer : [ 'ZTM' ,'NASA'], //payload.customers for each payload
//     upcoming : true, #upcoming
//     success : true, #sucess
// }
 
//saveLaunch(launch)
//launches.set(launch.flightNumber , launch);