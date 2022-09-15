const { connectMG } = require("../../config");
const esquemaProducto = require("../../models/producto");

class productosMongo {
	constructor() {
		(async () => {
			const db = await connectMG();
			if (!db) throw "No se pudo conectar con la base";
		})();
	}

	async save(nuevoProducto) {
		try {
			let nuevoProd = {
				timestamp: nuevoProducto.timestamp,
				nombre: nuevoProducto.nombre,
				descripcion: nuevoProducto.descripcion,
				codigo: nuevoProducto.codigo,
				foto: nuevoProducto.foto,
				precio: nuevoProducto.precio,
				stock: nuevoProducto.stock,
			};

			let productoCreado = new esquemaProducto(nuevoProd);
			let productoGuardado = await productoCreado.save();
			console.log(productoGuardado);
			return { mensaje: "producto guardado" };
		} catch (e) {
			return { mensaje: "no se pudo guardar el producto en el almacen", error: "eo" };
		}
	}

	async getById(ID) {
		try {
			const producto = await esquemaProducto.find({ _id: ID });
			return producto.length == 0
				? { mensaje: "almacen vacio / producto no encontrado" }
				: producto;
		} catch (e) {
			return { mensaje: "producto no encontrado", error: e };
		}
	}
	async getAll() {
		try {
			const productos = await esquemaProducto.find({});
			return productos.length == 0 ? { mensaje: "almacen vacio" } : productos;
		} catch (e) {
			return { mensaje: "no se encontraron los productos", error: e };
		}
	}
	async deleteById(ID) {
		try {
			const productoBorrado = await esquemaProducto.deleteOne({ _id: ID });
			console.log(productoBorrado);
			return { mensaje: "producto borrado" };
		} catch (e) {
			return { mensaje: "no se pudo borrar el producto", error: e };
		}
	}
	async actualizar(ID, nuevosValores) {
		try {
			const usuarioModificado = await esquemaProducto.updateOne(
				{ _id: ID },
				{ $set: { ...nuevosValores } }
			);
			console.log(usuarioModificado);
			return { mensaje: "producto actualizado" };
		} catch (e) {
			return { mensaje: "no se pudo actualizar el producto", error: e };
		}
	}
}

module.exports = productosMongo;
