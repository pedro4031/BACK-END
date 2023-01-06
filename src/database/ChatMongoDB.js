const { loggerE, logger } = require("../utils/loger");
const esquemaChat = require("./models/mensaje");
const esquemaUsuarios = require("./models/usuario");

class mensajesMongo {
	constructor() {}

	async getChat(sender, receiver) {
		try {
			if (receiver == null) {
				const mensajes = await esquemaChat.find({ sender: sender });
				return mensajes;
			} else {
				const mensajes = await esquemaChat.find({
					$or: [
						{ $and: [{ sender: sender }, { receiver: receiver }] },
						{ $and: [{ sender: receiver }, { receiver: sender }] },
					],
				});
				return mensajes;
			}
		} catch (err) {
			loggerE.error("no se encontraron los mensajes. " + err);
			return { mensaje: "no se encontraron los mensajes", error: err };
		}
	}

	async saveMsg(msg) {
		try {
			const mensajeCreado = new esquemaChat(msg);
			const mensajeGuardado = await mensajeCreado.save();
		} catch (err) {
			loggerE.error("no se guardó el mensaje. " + err);
			return { mensaje: "no se guardó el mensaje", error: err };
		}
	}

	async getUsuarios() {
		try {
			const usuarios = await esquemaUsuarios.find({ usuario: { $not: { $eq: "administrador1" } } });
			return usuarios;
		} catch (err) {
			loggerE.error("no se encontraron los usuarios. " + err);
			return { mensaje: "no se encontraron los usuarios", error: err };
		}
	}
}

module.exports = mensajesMongo;
