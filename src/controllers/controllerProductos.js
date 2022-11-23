const { logger } = require("../utils/loger");
const {
	obtenerProductos,
	obtenerIdProducto,
	agregarProducto,
	actualizarProducto,
	eliminarProducto,
} = require("../services/Productos");

//PAGINA ALMACEN
function getAlmacen(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	res.render("almacen", { user: req.user });
}

//PRODUCTOS
function getProds(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	obtenerProductos().then((resp) => res.json(resp));
}

//PRODUCTO POR ID
function getByIdProd(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let { id } = req.params;
	obtenerIdProducto(id).then((resp) => res.json(resp));
}

//AGREGAR PRODUCTO
function agregarProd(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let nuevoProd = req.body;
	agregarProducto(nuevoProd).then((resp) => res.json(resp));
}

//ACTUALIZAR PRODUCTO
function actualizarProd(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	let { id } = req.params;
	const update = req.body;
	actualizarProducto(id, update).then((resp) => res.json(resp));
}

//ELIMINAR PRODUCTO
function eliminarProd(req, res) {
	logger.info(`peticion a ruta ${req.originalUrl} con metodo ${req.method}`);
	const { id } = req.params;
	eliminarProducto(id).then((resp) => res.json(resp));
}

module.exports = { getAlmacen, getProds, getByIdProd, agregarProd, actualizarProd, eliminarProd };
