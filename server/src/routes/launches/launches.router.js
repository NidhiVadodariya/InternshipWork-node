const express = require('express');
const launchesRouter = express.Router();

const { httpGetAlllaunches,
        httpAddNewLaunch,
        httpAbortLaunch, } = require('../launches/launches.controller')

launchesRouter.get('/',httpGetAlllaunches);
launchesRouter.post('/',httpAddNewLaunch);
launchesRouter.delete('/:id',httpAbortLaunch);

module.exports = launchesRouter;