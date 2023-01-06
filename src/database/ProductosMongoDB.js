const { loggerE, logger } = require("../utils/loger");
const esquemaProducto = require("./models/producto");

class productosMongo {
	constructor() {}

	//PRODUCTOS
	async getAll() {
		try {
			const productos = await esquemaProducto.find({});
			return productos.length == 0 ? { mensaje: "almacen vacio" } : productos;
		} catch (e) {
			loggerE.error("no se encontraron los productos. " + e);
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}

	//PRODUCTO POR ID
	async getById(ID) {
		try {
			const producto = await esquemaProducto.find({ _id: ID });
			return producto.length == 0 ? { mensaje: "producto no encontrado" } : producto[0]._doc;
		} catch (e) {
			loggerE.error("producto no encontrado. " + e);
			return { mensaje: "producto no encontrado", error: e };
		}
	}

	//PRODUCTOS POR CATEGORIA
	async categories(categoria) {
		try {
			const productos = await esquemaProducto.find({ categoria: categoria });
			return productos.length == 0
				? { mensaje: "Categoria vacia/ categoria inexistente" }
				: productos;
		} catch (e) {
			loggerE.error("categoria no encontrada. " + e);
			return { mensaje: "categoria no encontrada.", error: e };
		}
	}

	//GUARDAR PRODUCTO EN ALMACEN
	async save(nuevoProducto) {
		try {
			let productoCreado = new esquemaProducto(nuevoProducto);
			let productoGuardado = await productoCreado.save();
			logger.info(productoGuardado);

			return { mensaje: "producto guardado" };
		} catch (e) {
			loggerE.error("no se pudo guardar el producto en el almacen. " + e);
			return { mensaje: "no se pudo guardar el producto en el almacen", error: e };
		}
	}

	//ACTUALIZAR PRODUCTO
	async actualizar(ID, nuevosValores) {
		try {
			const productoModificado = await esquemaProducto.updateOne(
				{ _id: ID },
				{ $set: { ...nuevosValores } }
			);
			logger.info(productoModificado);

			return { mensaje: "producto actualizado" };
		} catch (e) {
			loggerE.error("no se pudo actualizar el producto. " + e);
			return { mensaje: "no se pudo actualizar el producto", error: e };
		}
	}

	//BORRAR PRORDUCTO DEL ALMACEN
	async deleteById(ID) {
		try {
			const productoBorrado = await esquemaProducto.deleteOne({ _id: ID });
			logger.info(productoBorrado);

			return { mensaje: "producto borrado" };
		} catch (e) {
			loggerE.error("no se pudo borrar el producto. " + e);
			return { mensaje: "no se pudo borrar el producto", error: e };
		}
	}
}

module.exports = productosMongo;
