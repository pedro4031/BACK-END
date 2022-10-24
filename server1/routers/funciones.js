const config = require('../config');
const { fork } = require('child_process');
//INDEX
function getRoot(req, res) {
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
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
}

function postLogin(req, res) {
  res.redirect('/');
}

function getFailLogin(req, res) {
  let errorMessage = req.flash('error')[0];
  res.render('login-error', { error: errorMessage });
}

//SIGN UP
function getSignUp(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('signup');
  }
}

function postSignUp(req, res) {
  res.redirect('/');
}

function getFailSignUp(req, res) {
  let errorMessage = req.flash('error')[0];
  res.render('signup-error', { error: errorMessage });
}

//LOGOUT
function getLogout(req, res, next) {
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
  if (req.isAuthenticated()) {
    let argumentos = process.argv.slice(2);
    let rutaExe = process.argv0;

    res.render('infoProceso', { argEnt: argumentos, sisOp: process.platform, Vnode: process.version, mem: process.memoryUsage().rss, pathE: rutaExe, pId: process.pid, carpeta: process.cwd() });
  } else {
    res.redirect('/');
  }
}

//FUNCION CALCULAR NUMEROS ALEATORIOS
function getRandom(req, res) {
  if (req.isAuthenticated()) {
    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = config.PORT;
    const ApiRandom = fork('./apis/forkRandom.js');
    const fullUrl = `${protocol}://${host}:${port}${url}`;

    let parametro = parseInt(new URL(fullUrl).searchParams.get('cant'));

    isNaN(parametro) ? ApiRandom.send(100000000) : ApiRandom.send(parametro);

    ApiRandom.on('message', (data) => {
      res.json(data);
    });
  } else {
    res.redirect('/');
  }
}
module.exports = { getRoot, getLogin, getSignUp, postLogin, postSignUp, getFailLogin, getFailSignUp, getLogout, failRoute, checkAuthentication, getInfo, getRandom };
