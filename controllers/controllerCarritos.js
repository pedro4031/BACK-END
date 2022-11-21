const { logger } = require("../utils/loger");
const {
	crearCarrito,
	miCarrito,
	vaciarCarrito,
	productosCarrito,
	guardarProdCarrito,
	borrarProdCarrito,
	comprarCarrito,
} = require("../services/Carritos");

//CREAR CARRITO
async function createCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let id = req.user._id;
	await crearCarrito(id).then((resp) => res.json(resp));
}

//PAGINA MICARRITO
function miCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const id = req.user._id;
	miCarrito(id).then((resp) => {
		res.render("carrito", resp);
	});
}

//VACIAR CARRITO
function vaciarCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const id = req.user._id;
	vaciarCarrito(id).then((resp) => res.json(resp));
}

//PRODUCTOS DEL CARRITO
function getCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const id = req.user._id;
	productosCarrito(id).then((resp) => res.json(resp));
}

//AGREGAR PRODUCTO AL CARRITO
function addCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const idCart = req.user._id;
	const idProd = req.body.idProd;
	const cantProd = req.body.cantProd;
	guardarProdCarrito(idCart, idProd, cantProd).then((resp) => res.json(resp));
}

//BORRAR PRODUCTO DEL CARRITO
function deleteCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const id = req.user._id;
	const idProd = req.params.id_prod;
	borrarProdCarrito(id, idProd).then((resp) => res.json(resp));
}

//COMPRAR CARRITO
function buyCart(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let idCart = req.user._id;
	let productos = req.body;
	comprarCarrito(idCart, productos, req.user).then((resp) => res.json(resp));
}

module.exports = {
	createCart,
	miCart,
	vaciarCart,
	getCart,
	addCart,
	deleteCart,
	buyCart,
};
