const { logger } = require("../utils/loger");
const { getInfoProceso, getUserPerfil } = require("../services/Views");

//BIENVENIDA
function getBienvenida(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.render("Bienvenida");
}

//INDEX
function getRoot(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const { usuario } = req.user;
	res.render("Elementos", {
		nombre: usuario,
	});
}

//INFORMACION DEL PROCESO
function getInfo(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	getInfoProceso().then((data) => res.render("infoProceso", data));
}

//PERFIL
function getPerfil(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	getUserPerfil(req).then((data) => res.render("perfil", data));
}

//RUTA INEXISTENTE
function getFailRoute(req, res) {
	logger.warn(`peticion a ruta inexistente ${req.originalUrl} con metodo ${req.method}`);
	res.status(404).render("routing-error", {});
}

module.exports = { getBienvenida, getRoot, getPerfil, getInfo, getFailRoute };
