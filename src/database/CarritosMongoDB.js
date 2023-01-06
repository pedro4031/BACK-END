const { logger, loggerE } = require("../utils/loger");
const esquemaCarrito = require("./models/carrito");
const esquemaOrden = require("./models/orden");
class carritoMongo {
	constructor() {}

	//CREAR CARRITO
	async crear(user) {
		try {
			const nuevoCarrito = {
				timestamp: new Date(),
				_id: user._id,
				mail: user.username,
				direccion: user.direccion,
			};
			const carritoCreado = new esquemaCarrito(nuevoCarrito);
			let carrito = await carritoCreado.save();
			logger.info(carrito);
		} catch (e) {
			loggerE.error("no se pudo crear el carrito." + e);
			return { mensaje: "no se pudo crear el carrito", error: e };
		}
	}

	//GURDAR PRODUCTO EN CARRITO
	async save(ID, nuevoProducto) {
		try {
			let productoGuardado = await esquemaCarrito.updateOne(
				{ _id: ID },
				{ $push: { productos: nuevoProducto } }
			);
			logger.info(productoGuardado);
			return { mensaje: "producto guardado" };
		} catch (e) {
			loggerE.error("no se pudo guardar el producto en el carrito. " + e);
			return { mensaje: "no se pudo guardar el producto en el carrito", error: e };
		}
	}

	//PRODUCTOS DEL CARRITO
	async getAll(ID) {
		try {
			const carrito = await esquemaCarrito.find({ _id: ID });
			return carrito[0].productos.length == 0 ? [] : carrito[0].productos;
		} catch (e) {
			loggerE.error("no se encontraron los productos." + e);
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}

	//BORRAR PRODUCTO DEL CARRITO
	async deleteById(ID, productosCarrito) {
		try {
			await esquemaCarrito.updateOne({ _id: ID }, { $set: { productos: productosCarrito } });
			return { mensaje: "producto borrado" };
		} catch (e) {
			loggerE.error("no se pudo borrar producto del carrito." + e);
			return { mensaje: "no se pudo borrar producto del carrito", error: e };
		}
	}

	//VACIAR CARRITO
	async deleteAll(ID) {
		try {
			await esquemaCarrito.updateOne({ _id: ID }, { $set: { productos: [] } });
			return { mensaje: "carrito vaciado" };
		} catch (e) {
			loggerE.error("no se pudo borrar el carrito. " + e);
			return { mensaje: "no se pudo borrar el carrito", error: e };
		}
	}

	//Actualizar carrito
	async updateCart(id, prods) {
		try {
			await esquemaCarrito.updateOne({ _id: id }, { $set: { productos: prods } });
			return { mensaje: "carrito actualizado" };
		} catch (e) {
			loggerE.error("no se pudo actualizar el carrito. " + e);
			return { mensaje: "no se pudo actualizar el carrito", error: e };
		}
	}

	async getOrdenes(mail) {
		try {
			let ordenes = esquemaOrden.find({ mail: mail }).lean();
			return ordenes;
		} catch (e) {
			loggerE.error("no se encontraron las ordenes. " + e);
			return { mensaje: "no se encontraron las ordenes", error: e };
		}
	}

	async saveOrden(orden) {
		try {
			let ordenCreada = new esquemaOrden(orden);
			let ordenGuardada = await ordenCreada.save();
			return true;
		} catch (e) {
			loggerE.error("no se pudo guardar la orden. " + e);
			return { mensaje: "no se pudo guardar la orden", error: e };
		}
	}
}

module.exports = carritoMongo;
