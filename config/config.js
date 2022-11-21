require("dotenv").config();
const yargs = require("yargs/yargs")(process.argv.slice(2));
const args = yargs.argv;

module.exports = {
	MODO: args.modo || undefined,

	PORT: process.env.PORT || args.PORT || 8080,

	MONGODB_URL: process.env.MONGODB_URL,

	SESSION_CLAVE: process.env.SESSION_CLAVE || "clave123",

	MAIL_NOTIFICACIONES: process.env.MAIL_NOTIFICACIONES || undefined,

	CONTRASEÑA_MAIL: process.env.CONTRASENA_MAIL || undefined,

	TELEFONO_NOTIFICACIONES: process.env.TELEFONO_NOTIFICACIONES || undefined,

	SID: process.env.SID || undefined,

	AUTH_TOKEN: process.env.AUTH_TOKEN || undefined,
};
