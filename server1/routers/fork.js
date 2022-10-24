const express = require('express');
const routes = require('./funciones');
const routerFork = express.Router();

routerFork.get('/info', routes.getInfo);

routerFork.get('/api/randoms', routes.getRandom);

module.exports = routerFork;
