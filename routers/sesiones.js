const express = require('express');
const { Router } = express;

const routerSession = express.Router();

routerSession.get('/login', (req, res) => {
  const nombre = req.session?.nombre;
  if (nombre) {
    res.redirect('/');
  } else {
    res.render('Login');
  }
});

routerSession.post('/login', (req, res) => {
  req.session.nombre = req.body.nombre;
  res.redirect('/');
});

routerSession.get('/logout', (req, res) => {
  const nombre = req.session?.nombre;
  if (nombre) {
    req.session.destroy((err) => {
      if (!err) {
        res.render('Logout', { nombre });
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = routerSession;
