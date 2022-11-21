const routerSession = require("express").Router();
const middlewares = require("../middlewares/imports");
const controllers = require("../controllers/controllerSessions");

//PAGINA LOGIN
routerSession.get("/login", controllers.getLogin);

//INICIAR SESION
routerSession.post(
	"/login",
	middlewares.passport.authenticate("login", { failureRedirect: "/failLogin", failureFlash: true }),
	controllers.postLogin
);

//FAIL/ERROR LOGIN
routerSession.get("/failLogin", controllers.getFailLogin);

//PAGINA SIGNUP
routerSession.get("/signup", controllers.getSignUp);

//REGISTRAR USUARIO NUEVO
routerSession.post(
	"/signup",
	middlewares.passport.authenticate("signup", {
		failureRedirect: "/failSignup",
		failureFlash: true,
	}),
	controllers.postSignUp
);

//FAIL/ERROR SIGNUP
routerSession.get("/failSignup", controllers.getFailSignUp);

//LOGOUT
routerSession.get("/logout", controllers.getLogOut);

module.exports = routerSession;
