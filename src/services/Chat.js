const { loggerE } = require("../utils/loger");

//CHAT
async function getChatUsuario(mail) {
	try {
		if (mail == "admin@gmail.com") {
			return "chatAdmin";
		} else {
			return "chat";
		}
	} catch (e) {
		loggerE.error("no se pudo seleccionar la plantilla." + e);
	}
}

module.exports = { getChatUsuario };
