const { logger } = require("../utils/loger");

function checkAdmin(req, res, next) {
	if (req.user.username == "admin@gmail.com") {
		next();
	} else {
		let metodo = req.method;
		let ruta = req.originalUrl;
		logger.warn(
			`pedido a ruta ${ruta} con metodo ${metodo} no autorizada por ${req.user.username}.`
		);
		res.redirect("/");
	}
}

module.exports = { checkAdmin };
