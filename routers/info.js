const express = require('express');
const routes = require('./funciones');
const routerInfo = express.Router();

routerInfo.get('/info', routes.getInfo);

//routerFork.get('/api/randoms', routes.getRandom);

module.exports = routerInfo;
