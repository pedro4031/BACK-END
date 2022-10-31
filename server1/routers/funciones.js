const config = require('../config');
const { fork } = require('child_process');
const { logger } = require('../loger');
//INDEX
function getRoot(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (req.isAuthenticated()) {
    const { username, password } = req.user;
    const user = { username, password };
    res.render('Elementos', { nombre: user });
  } else {
    res.render('Bienvenida');
  }
}
//LOGIN
function getLogin(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
}

function postLogin(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  res.redirect('/');
}

function getFailLogin(req, res) {
  let errorMessage = req.flash('error')[0];
  res.render('login-error', { error: errorMessage });
}

//SIGN UP
function getSignUp(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('signup');
  }
}

function postSignUp(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  res.redirect('/');
}

function getFailSignUp(req, res) {
  let errorMessage = req.flash('error')[0];
  res.render('signup-error', { error: errorMessage });
}

//LOGOUT
function getLogout(req, res, next) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (req.user) {
    const { username, password } = req.user;
    const user = { username, password };
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.render('Logout', { nombre: user.username });
    });
  } else {
    res.redirect('/');
  }
}

//ERROR DE RUTA
function failRoute(req, res) {
  logger.warn(`peticion a ruta inexistente ${req.originalUrl} con metodo ${req.method}`);
  res.status(404).render('routing-error', {});
}

//FUNCION DE CHEQUEO
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json('logout');
  }
}

//FUNCION INFO DEL PROCESO
function getInfo(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (true) {
    let argumentos = process.argv.slice(2);
    let rutaExe = process.argv0;
    let cantCPU = require('os').cpus().length;

    let info = {
      argEnt: argumentos,
      sisOp: process.platform,
      Vnode: process.version,
      mem: process.memoryUsage().rss,
      pathE: rutaExe,
      pId: process.pid,
      carpeta: process.cwd(),
      CPUs: cantCPU,
    };

    console.log(info);

    res.render('infoProceso', info);
  } else {
    res.redirect('/');
  }
}

//FUNCION CALCULAR NUMEROS ALEATORIOS
function getRandom(req, res) {
  logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
  if (req.isAuthenticated()) {
    const ApiRandom = fork('./apis/forkRandom.js');
    let parametro = req.query.cant;

    isNaN(parametro) ? ApiRandom.send(100000000) : ApiRandom.send(parametro);

    ApiRandom.on('message', (data) => {
      res.json(data);
    });
  } else {
    res.redirect('/');
  }
}
module.exports = { getRoot, getLogin, getSignUp, postLogin, postSignUp, getFailLogin, getFailSignUp, getLogout, failRoute, checkAuthentication, getInfo, getRandom };
