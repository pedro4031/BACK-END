const { loggerE } = require("../utils/loger");

//INFORMACION DEL PROCESO
async function getInfoProceso() {
	try {
		let argumentos = process.argv.slice(2);
		let rutaExe = process.argv0;
		let cantCPU = require("os").cpus().length;

		let info = {
			argEnt: argumentos,
			sisOp: process.platform,
			Vnode: process.version,
			mem: process.memoryUsage().rss,
			pathE: rutaExe,
			pId: process.pid,
			carpeta: process.cwd(),
			CPUs: cantCPU,
		};

		return info;
	} catch (e) {
		loggerE.error("no se pudo encontrar la información del proceso." + e);
		return { mensaje: "no se pudo encontrar la información del proceso.", error: e };
	}
}

//PERFIL
async function getUserPerfil(req) {
	try {
		let infoPerfil = {
			mail: req.user.username,
			usuario: req.user.usuario,
			edad: req.user.edad,
			direccion: req.user.direccion,
			telefono: req.user.telefono,
			prefijo: req.user.prefijo,
			avatar: req.user.avatar,
		};
		return infoPerfil;
	} catch (e) {
		loggerE.error("no se pudo encontrar la información del usuario." + e);
		return { mensaje: "no se pudo encontrar la información del usuario.", error: e };
	}
}

module.exports = { getInfoProceso, getUserPerfil };
