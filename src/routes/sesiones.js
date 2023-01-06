const routerSession = require("express").Router();
const middlewares = require("../middlewares/imports");
const controllers = require("../controllers/controllerSessions");

//PAGINA LOGIN
routerSession.get("/login", controllers.getLogin);

//INICIAR SESION
routerSession.post("/login", middlewares.LOGIN);

//PAGINA SIGNUP
routerSession.get("/signup", controllers.getSignUp);

//REGISTRAR USUARIO NUEVO
routerSession.post("/signup", middlewares.SIGNUP);

//LOGOUT
routerSession.get("/logout", controllers.getLogOut);

module.exports = routerSession;
