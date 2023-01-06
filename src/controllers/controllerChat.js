const { logger } = require("../utils/loger");
const { getChatUsuario } = require("../services/Chat");
const { mensajesMongo } = require("../database/imports");

const mensajes = new mensajesMongo();

//CHAT
function getChat(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let mail = req.user.username;
	getChatUsuario(mail).then((resp) => {
		res.render(resp, { usuario: JSON.stringify(req.user) });
	});
}

//MENSAJES
function getMessages(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let { sender, receiver } = req.body;
	mensajes.getChat(sender, receiver).then((data) => res.json(data));
}

//USUARIOS
function getUsuarios(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	mensajes.getUsuarios().then((data) => res.json(data));
}

function getUserMsg(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let { usuario } = req.params;
	if (usuario == req.user.usuario) {
		mensajes.getChat(usuario, null).then((data) => res.json(data));
	} else {
		res.json({ mensaje: "no se pueden buscar mensajes que no sean tuyos." });
	}
}

module.exports = { getChat, getMessages, getUsuarios, getUserMsg };
