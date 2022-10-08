const flash = require('connect-flash');

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

module.exports = { getRoot, getLogin, getSignUp, postLogin, postSignUp, getFailLogin, getFailSignUp, getLogout, failRoute, checkAuthentication };
