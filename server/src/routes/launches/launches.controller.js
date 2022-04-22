const { getAlllaunches,
        scheduleNewLaunch,
        existsLaunchWithId,
        abortLaunchById, } = require('../../models/launches.model');

const { getPagination } = require('../../services/query')

async function httpGetAlllaunches(req,res) {
    const {skip , limit} = getPagination(req.query); 
    const launches = await getAlllaunches(skip,limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req,res) {
    const launch = req.body;

    if(!(launch.mission && launch.rocket && launch.launchDate && launch.target)){
        return res.status(400).json({
            error : 'missing required launch property',
        })
    }
    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error : 'Invalid launch date',
        })
    }

    const data = await scheduleNewLaunch(launch);
    if(!data){
        return res.status(404).json({
            error : "not working"
        })
    }
    return res.status(200).json(data)
}

async function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    const existLaunch = await existsLaunchWithId(launchId);
    if(!existLaunch){
        return res.status(404).json({
            error : 'Launch not found',
        });
    }
    aborted = abortLaunchById(launchId);
    if(aborted){
        return res.status(200).json({
            status : "aborted"});
    }
    return res.status(400).json({
        status : "some problem in aborting process"});

}
module.exports = {
    httpGetAlllaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}