const { admin } = require("../../config");

class productosFireBase {
	constructor() {
		const db = admin.firestore();
		this.colProductos = db.collection("productos");
	}
	async save(nuevoProducto) {
		try {
			const doc = this.colProductos.doc();
			await doc.create(nuevoProducto);
			return { idDeProducto: doc.id };
		} catch (e) {
			return { mensaje: "no se pudo guardar el producto", error: e };
		}
	}
	async getAll() {
		try {
			const query = await this.colProductos.get();
			let prods = query.docs;
			const productos = prods.map((doc) => ({
				id: doc.id,
				timestamp: doc.data().timestamp,
				nombre: doc.data().nombre,
				descripcion: doc.data().descripcion,
				codigo: doc.data().codigo,
				foto: doc.data().foto,
				precio: doc.data().precio,
				stock: doc.data().stock,
			}));
			return prods.length == 0 ? { mensaje: "almacen vacio" } : productos;
		} catch (e) {
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}
	async getById(ID) {
		try {
			const doc = this.colProductos.doc(ID);
			const prod = await doc.get();
			const producto = { id: prod.id, ...prod.data() };
			return prod.data() == undefined
				? { mensaje: "almacen vacio / producto no encontrado" }
				: producto;
		} catch (e) {
			return { mensaje: "producto no encontrado", error: e };
		}
	}

	async deleteById(ID) {
		try {
			const prod = this.colProductos.doc(ID);
			const data = await prod.delete();
			return { mensaje: "producto eliminado", data };
		} catch (e) {
			return { mensaje: "no se pudo borrar el producto", error: e };
		}
	}

	async actualizar(ID, nuevosValores) {
		try {
			const prod = this.colProductos.doc(ID);
			let productoActualizado = await prod.update(nuevosValores);
			return { mensaje: "producto actualizado", productoActualizado };
		} catch (e) {
			return { mensaje: "no se pudo actualizar el producto", error: e };
		}
	}
}

module.exports = productosFireBase;
