const { logger } = require("../utils/loger");

//PAGINA LOGIN
function getLogin(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.render("Login");
}

//INICIAR SESION
function postLogin(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.redirect("/");
}

//FAIL/ERROR LOGIN
function getFailLogin(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let errorMessage = req.flash("error")[0];
	res.render("login-error", { error: errorMessage });
}

//PAGINA SIGNUP
function getSignUp(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.render("Signup");
}

//REGISTRAR NUEVO USUARIO
function postSignUp(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.redirect("/");
}

//FAIL/ERROR SIGNUP
function getFailSignUp(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let errorMessage = req.flash("error")[0];
	res.render("signup-error", { error: errorMessage });
}

//LOGOUT
function getLogOut(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.user) {
		const { usuario } = req.user;

		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.render("Logout", { nombre: usuario });
		});
	} else {
		res.redirect("/");
	}
}

module.exports = {
	getLogin,
	postLogin,
	getFailLogin,
	getSignUp,
	postSignUp,
	getFailSignUp,
	getLogOut,
};
