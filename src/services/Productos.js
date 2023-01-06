const { logger, loggerE } = require("../utils/loger");
const { productosMongo } = require("../database/imports");

const almacenProductos = new productosMongo();

//OBTENER TODOS LOS PRODUCTOS
async function obtenerProductos() {
	try {
		return almacenProductos.getAll();
	} catch (e) {
		loggerE.error("no se pudieron encontrar los productos." + e);
		return { mensaje: "no se encontraron los productos", error: e };
	}
}

//OBTENER PRODUCTO POR ID
async function obtenerIdProducto(id) {
	try {
		return almacenProductos.getById(id);
	} catch (e) {
		loggerE.error("no se pudo buscar el producto." + e);
		return { mensaje: "no se pudo buscar el producto.", error: e };
	}
}

//OBTENER PRODUCTO POR CATEGORIA
async function obtenerCategoriaProductos(categoria) {
	try {
		return almacenProductos.categories(categoria);
	} catch (e) {
		loggerE.error("no se pudo buscar la categoria." + e);
		return { mensaje: "no se pudo buscar la categoria de productos.", error: e };
	}
}

//AGREGAR PRODUCTO AL ALMACEN
async function agregarProducto(nuevoProd) {
	try {
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

		return almacenProductos.save(nuevoProducto);
	} catch (e) {
		loggerE.error("no se pudo agregar el producto." + e);
		return { mensaje: "no se pudo agregar el producto.", error: e };
	}
}

//ACTUALIZAR PRODUCTO
async function actualizarProducto(id, update) {
	try {
		let updatedProd = {};

		update.hasOwnProperty("timestamp") && (updatedProd.timestamp = update.timestamp);
		update.hasOwnProperty("categoria") && (updatedProd.categoria = update.categoria);
		update.hasOwnProperty("nombre") && (updatedProd.nombre = update.nombre);
		update.hasOwnProperty("descripcion") && (updatedProd.descripcion = update.descripcion);
		update.hasOwnProperty("codigo") && (updatedProd.codigo = update.codigo);
		update.hasOwnProperty("foto") && (updatedProd.foto = update.foto);
		update.hasOwnProperty("precio") && (updatedProd.precio = update.precio);
		update.hasOwnProperty("stock") && (updatedProd.stock = update.stock);
		if (Object.entries(updatedProd).length === 0) {
			return { mensaje: "sin datos para actualizar" };
		} else {
			return almacenProductos.actualizar(id, updatedProd);
		}
	} catch (e) {
		loggerE.error("no se pudo actualizar el producto" + e);
		return { mensaje: "no se pudo actualizar el producto", error: e };
	}
}

//BORRAR PRODUCTO
async function eliminarProducto(id) {
	try {
		return almacenProductos.deleteById(id);
	} catch (e) {
		loggerE.error("no se pudo borrar el producto" + e);
		res.json({ mensaje: "no se pudo borrar el producto", error: e });
	}
}

module.exports = {
	obtenerProductos,
	obtenerIdProducto,
	obtenerCategoriaProductos,
	agregarProducto,
	actualizarProducto,
	eliminarProducto,
};
