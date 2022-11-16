const { logger, loggerE } = require("../loger");
const { carritoMongo, productosMongo } = require("../controllers/daos/imports");
const Carritos = new carritoMongo();
const almacenProductos = new productosMongo();
const { sendMail, sendWpp } = require("../nodemailerConfig");
const config = require("../config");

//---INDEX------------------------------------------------------------------------------------
function getRoot(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.isAuthenticated()) {
		const { usuario } = req.user;

		res.render("Elementos", {
			nombre: usuario,
		});
	} else {
		res.render("Bienvenida");
	}
}

//---LOGIN-------------------------------------------------------------------------------------
function getLogin(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		res.render("Login");
	}
}

function postLogin(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.redirect("/");
}

function getFailLogin(req, res) {
	let errorMessage = req.flash("error")[0];
	res.render("login-error", { error: errorMessage });
}

//---SIGN UP------------------------------------------------------------------------------------
function getSignUp(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		res.render("Signup");
	}
}

function postSignUp(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.redirect("/");
}

function getFailSignUp(req, res) {
	let errorMessage = req.flash("error")[0];
	res.render("signup-error", { error: errorMessage });
}

//---LOGOUT-------------------------------------------------------------------------------------
function getLogout(req, res, next) {
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

//---ERROR DE RUTA------------------------------------------------------------------------------
function failRoute(req, res) {
	logger.warn(`peticion a ruta inexistente ${req.originalUrl} con metodo ${req.method}`);
	res.status(404).render("routing-error", {});
}

//---FUNCION DE CHEQUEO-------------------------------------------------------------------------
function checkAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/");
	}
}

//---FUNCION INFO DEL PROCESO-------------------------------------------------------------------
function getInfo(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.isAuthenticated()) {
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

		res.render("infoProceso", info);
	} else {
		res.redirect("/");
	}
}

//---PERFIL-------------------------------------------------------------------------------------

function getPerfil(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (req.isAuthenticated()) {
		let infoPerfil = {
			mail: req.user.username,
			usuario: req.user.usuario,
			edad: req.user.edad,
			direccion: req.user.direccion,
			telefono: req.user.telefono,
			prefijo: req.user.prefijo,
			avatar: req.user.avatar,
		};

		res.render("perfil", infoPerfil);
	} else {
		res.redirect("/");
	}
}

//---CHECK ADMIN--------------------------------------------------------------------------------

function checkAdmin(req, res, next) {
	if (req.user.username == "admin@gmail") {
		next();
	} else {
		let metodo = req.method;
		let ruta = req.originalUrl;
		logger.warn(`ruta ${ruta} con metodo ${metodo} no autorizada.`);
		res.redirect("/");
	}
}

//---FUNCIONES PRODUCTOS------------------------------------------------------------------------

//ALMACEN
function getAlmacen(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);

	res.render("almacen", { user: req.user });
}

//GET ALL
async function getAllProds(req, res) {
	try {
		await almacenProductos.getAll().then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("no se encontraron los productos." + e);
		res.json({ mensaje: "no se encontraron los productos", error: e });
	}
}

//GET BY ID
async function getByIdProd(req, res) {
	try {
		let { id } = req.params;
		await almacenProductos.getById(id).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("no se pudo buscar el producto." + e);
		res.json({ mensaje: "no se pudo buscar el producto.", error: e });
	}
}

//POST PRODUCTO
async function postProd(req, res) {
	try {
		let nuevoProd = req.body;
		let nuevoProducto = {
			timestamp: nuevoProd.timestamp,
			categoria: nuevoProd.categoria,
			nombre: nuevoProd.nombre,
			descripcion: nuevoProd.descripcion,
			codigo: nuevoProd.codigo,
			foto: nuevoProd.foto,
			precio: nuevoProd.precio,
			stock: nuevoProd.stock,
		};

		await almacenProductos.save(nuevoProducto).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("no se pudo agregar el producto." + e);
		res.json({ mensaje: "no se pudo agregar el producto.", error: e });
	}
}

//ACTUALIZAR PRODUCTO
async function updateProd(req, res) {
	try {
		let { id } = req.params;
		const update = req.body;

		let updatedProd = {};

		update.hasOwnProperty("timestamp") && (updatedProd.timestamp = update.timestamp);
		update.hasOwnProperty("categoria") && (updatedProd.categoria = update.categoria);
		update.hasOwnProperty("nombre") && (updatedProd.nombre = update.nombre);
		update.hasOwnProperty("descripcion") && (updatedProd.descripcion = update.descripcion);
		update.hasOwnProperty("codigo") && (updatedProd.codigo = update.codigo);
		update.hasOwnProperty("foto") && (updatedProd.foto = update.foto);
		update.hasOwnProperty("precio") && (updatedProd.precio = update.precio);
		update.hasOwnProperty("stock") && (updatedProd.stock = update.stock);
		Object.entries(updatedProd).length === 0
			? res.json({ mensaje: "sin datos para actualizar" })
			: await almacenProductos.actualizar(id, updatedProd).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("no se pudo actualizar el producto" + e);
		res.json({ mensaje: "no se pudo actualizar el producto", error: e });
	}
}

//BORRAR PRODUCTO
async function deleteProd(req, res) {
	try {
		const ID = req.params.id;
		await almacenProductos.deleteById(ID).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("no se pudo borrar el producto" + e);
		res.json({ mensaje: "no se pudo borrar el producto", error: e });
	}
}

//---FUNCIONES CARRITO--------------------------------------------------------------------------

//MI CARRITO
function miCarrito(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	if (!req.isAuthenticated()) {
		res.redirect("/");
	} else {
		let prods = [];
		try {
			const id = req.user._id;
			Carritos.getAll(id).then((resp) => {
				prods = resp;
				let estado;
				prods.length > 0 ? (estado = true) : (estado = false);
				res.render("carrito", { productos: prods, exists: estado });
			});
		} catch (e) {
			logger.warn("carrito vacio/no se encontraron los productos. " + e);
			res.render("carrito", { productos: [] });
		}
	}
}

//CREAR CARRITO
async function createCart(req, res) {
	try {
		await Carritos.crear().then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("No se pudo crear el carrito." + e);
		res.json({ mensaje: "No se pudo crear el carrito.", error: e });
	}
}

//VACIAR CARRITO
async function deleteCart(req, res) {
	try {
		const idCart = req.user._id;
		await Carritos.deleteAll(idCart).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("No se pudo vaciar el carrito." + e);
		res.json({ mensaje: "No se pudo vaciar el carrito", error: e });
	}
}

//PRODUCTOS DEL CARRITO
async function cartProds(req, res) {
	try {
		const id = req.user._id;
		Carritos.getAll(id).then((resp) => res.json(resp));
	} catch (e) {
		loggerE.error("No se pudieron encontrar los productos/carrito." + e);
		res.json({ mensaje: "No se pudieron encontrar los productos/carrito.", error: e });
	}
}

//GUARDAR PRODUCTO EN CARRITO
async function postCartProd(req, res) {
	try {
		const idCart = req.user._id;
		const idProd = req.body.idProd;
		const cantProd = req.body.cantProd;
		almacenProductos.getById(idProd).then((prod) => {
			prodCart = { ...prod["0"]._doc };
			prodCart.cantidad = cantProd;
			prodCart.precioTotal = parseFloat(cantProd * prodCart.precio);
			Carritos.save(idCart, prodCart).then((resp) => res.json(resp));
		});
	} catch (e) {
		loggerE.error("No se pudo guardar el producto en el carrito." + e);
		res.json({ mensaje: "No se pudo guardar el producto en el carrito", error: e });
	}
}
//BORRAR PRODUCTO DEL CARRITO
async function deleteCartProd(req, res) {
	try {
		const id = req.user._id;
		const idProd = req.params.id_prod;
		Carritos.deleteById(id, idProd).then((resp) => {
			res.json(resp);
		});
	} catch (e) {
		loggerE.error("No se pudo borrar el producto." + e);
		res.json({ mensaje: "No se pudo borrar el producto.", error: e });
	}
}

function comprar(req, res) {
	let idCart = req.user._id;
	let productos = req.body;
	try {
		Carritos.deleteAll(idCart).then((resp) => {
			if (resp.mensaje == "carrito vaciado") {
				let cuerpoMail = productos.reduce(
					(cuerpo, datosProds) =>
						cuerpo +
						`<p>id: ${datosProds._id},nombre: ${datosProds.nombre},cantidad: ${datosProds.cantidad}</p>`,
					"<h3>Lista de productos pedidos:</h3>"
				);
				sendMail(`Nuevo pedido de ${req.user.usuario}-mail: ${req.user.username}.`, cuerpoMail);

				let cuerpoWpp = productos.reduce(
					(cuerpo, datosProds) =>
						cuerpo +
						`/id:${datosProds._id}, nombre: ${datosProds.nombre}, cantidad: ${datosProds.cantidad}/ `,
					`Nuevo pedido de ${req.user.usuario}-mail: ${req.user.username}. `
				);
				let numCliente = `${req.user.prefijo}${req.user.telefono}`;
				sendWpp(config.TELEFONO_NOTIFICACIONES, cuerpoWpp);
				sendWpp(numCliente, "compra realizada. Pedido en proceso");
				res.json({ mensaje: "compra realizada" });
			} else {
				res.json({ mensaje: "no se logro la compra" });
			}
		});
	} catch (e) {
		loggerE.error("No se pudo vaciar el carrito." + e);
		res.json({ mensaje: "No se pudo vaciar el carrito", error: e });
	}
}

//---EXPORT DE FUNCIONES------------------------------------------------------------------------
module.exports = {
	getRoot,
	getLogin,
	getSignUp,
	postLogin,
	postSignUp,
	getFailLogin,
	getFailSignUp,
	getLogout,
	failRoute,
	checkAuthentication,
	getInfo,
	getPerfil,
	checkAdmin,
	getAlmacen,
	getAllProds,
	getByIdProd,
	postProd,
	updateProd,
	deleteProd,
	miCarrito,
	createCart,
	deleteCart,
	cartProds,
	postCartProd,
	deleteCartProd,
	comprar,
};
