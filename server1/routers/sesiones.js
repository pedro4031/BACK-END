const express = require('express');
const passport = require('passport');
const routes = require('./funciones');
const routerSession = express.Router();

//INDEX
routerSession.get('/', routes.getRoot);

//LOGIN
routerSession.get('/login', routes.getLogin);
routerSession.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin', failureFlash: true }), routes.postLogin);
routerSession.get('/failLogin', routes.getFailLogin);

//SIGNUP
routerSession.get('/signup', routes.getSignUp);
routerSession.post('/signup', passport.authenticate('signup', { failureRedirect: '/failSignup', failureFlash: true }), routes.postSignUp);
routerSession.get('/failSignup', routes.getFailSignUp);

//LOGOUT
routerSession.get('/logout', routes.getLogout);

//FAIL ROUTE
routerSession.get('*', routes.failRoute);
routerSession.post('*', routes.failRoute);

module.exports = routerSession;
