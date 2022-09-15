const { admin } = require("../../config");

class carritoFireBase {
	constructor() {
		const db = admin.firestore();
		this.colCarritos = db.collection("carritos");
	}
	async crear() {
		try {
			const cart = this.colCarritos.doc();

			const carrito = {
				timestamp: new Date(),
				productos: [],
			};

			await cart.create(carrito);
			return { idDeCarrito: cart.id };
		} catch (e) {
			return { mensaje: "no se pudo crear el carrito", error: e };
		}
	}
	async save(ID, nuevoProducto) {
		try {
			this.getAll(ID).then(async (resp) => {
				let array = [...resp, nuevoProducto];

				const cart = this.colCarritos.doc(ID);
				const carritoActualizado = await cart.update({ productos: array });
			});
			return { mensaje: "producto guardado en el carrito" };
		} catch (e) {
			return { mensaje: "no se pudo guardar el producto en el carrito", error: e };
		}
	}
	async getAll(ID) {
		try {
			const query = this.colCarritos.doc(ID);
			let prods = await query.get();
			const productos = prods.data().productos.map((doc) => ({
				id: doc.id,
				timestamp: doc.timestamp,
				nombre: doc.nombre,
				descripcion: doc.descripcion,
				codigo: doc.codigo,
				foto: doc.foto,
				precio: doc.precio,
				stock: doc.stock,
			}));
			return prods.length == 0 ? { mensaje: "almacen vacio" } : productos;
		} catch (e) {
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}
	async deleteById(ID, idProd) {
		try {
			let productos = await this.getAll(ID);

			let index = productos.findIndex((prod) => prod.id == idProd);
			console.log(index);
			if (index == -1) {
				return { mensaje: "producto no encontrado en carrito" };
			} else {
				productos.splice(index, 1);
				const cart = this.colCarritos.doc(ID);

				const carritoActualizado = await cart.update({ productos: productos });
				return { mensaje: "producto eliminado del carrito" };
			}
		} catch (e) {
			return { mensaje: "no se pudo borrar el producto del carrito", error: e };
		}
	}
	async deleteAll(ID) {
		try {
			const doc = this.colCarritos.doc(ID);
			const carritoBorrado = await doc.delete();
			return { mensaje: "carrito borrado", carritoBorrado };
		} catch (e) {
			return { mensaje: "no se pudo borrar el carrito", error: e };
		}
	}
}

module.exports = carritoFireBase;
