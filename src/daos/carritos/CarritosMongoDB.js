const { connectMG } = require("../../config");
const esquemaCarrito = require("../../models/carrito");

class carritoMongo {
	constructor() {
		(async () => {
			const db = await connectMG();
			if (!db) throw "No se pudo conectar con la base";
		})();
	}
	async crear() {
		try {
			const nuevoCarrito = {
				timestamp: new Date(),
			};
			const carritoCreado = new esquemaCarrito(nuevoCarrito);
			let carritoGuardado = await carritoCreado.save();
			return { idDeCarrito: carritoGuardado["_id"] };
		} catch (e) {
			return { mensaje: "no se pudo crear el carrito", error: e };
		}
	}

	async save(ID, nuevoProducto) {
		try {
			let productoGuardado = await esquemaCarrito.updateOne(
				{ _id: ID },
				{ $push: { productos: nuevoProducto } }
			);
			console.log(productoGuardado);
			return { mensaje: "producto guardado" };
		} catch (e) {
			return { mensaje: "no se pudo guardar el producto en el carrito", error: e };
		}
	}

	async getAll(ID) {
		try {
			const carrito = await esquemaCarrito.find({ _id: ID });
			return carrito[0].productos.length == 0
				? { mensaje: "carrito vacio" }
				: { productos: carrito[0].productos };
		} catch (e) {
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}

	async deleteById(ID, idProd) {
		try {
			let productosCarrito = await this.getAll(ID);

			let index = productosCarrito.productos.findIndex((prod) => {
				JSON.stringify(prod["_id"]) == `${idProd}`;
			});
			if (index == -1) {
				return { mensaje: "producto no encontrado en carrito" };
			} else {
				productosCarrito.productos.splice(index, 1);
				await esquemaCarrito.updateOne(
					{ _id: ID },
					{ $set: { productos: productosCarrito.productos } }
				);
				return { mensaje: "producto borrado de carrito" };
			}
		} catch (e) {
			return { mensaje: "no se pudo borrar producto del carrito", error: e };
		}
	}

	async deleteAll(ID) {
		try {
			const carritoBorrado = await esquemaCarrito.deleteOne({ _id: ID });
			return { mensaje: "carrito borrado" };
		} catch (e) {
			return { mensaje: "no se pudo borrar el carrito", error: e };
		}
	}
}

module.exports = carritoMongo;
