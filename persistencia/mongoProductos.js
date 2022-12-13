const esquemaProducto = require("./schemaProd");

async function getProductos() {
	try {
		const productos = await esquemaProducto.find({});
		return productos.length == 0 ? [] : productos;
	} catch (e) {
		console.error("no se encontraron los productos. " + e);
		return { mensaje: "no se encontraron los productos", error: e };
	}
}
async function getProducto({ _id }) {
	try {
		const producto = await esquemaProducto.find({ _id: _id });

		return producto.length == 0 ? {} : producto;
	} catch (e) {
		console.error("producto no encontrado. " + e);
		return { mensaje: "producto no encontrado", error: e };
	}
}
async function createProducto(nuevoProducto) {
	try {
		let productoCreado = new esquemaProducto(nuevoProducto.datos);
		let productoGuardado = await productoCreado.save();
		console.log(productoGuardado);
		return productoGuardado;
	} catch (e) {
		console.error("no se pudo guardar el producto en el almacen. " + e);
		return { mensaje: "no se pudo guardar el producto en el almacen", error: e };
	}
}
async function updateProducto({ _id, datos }) {
	let updatedProd = {};

	datos.nombre != "null" && (updatedProd.nombre = datos.nombre);
	datos.precio != null && (updatedProd.precio = datos.precio);
	datos.foto != "null" && (updatedProd.foto = datos.foto);
	datos.stock != null && (updatedProd.stock = datos.stock);
	try {
		const productoModificado = await esquemaProducto.updateOne(
			{ _id: _id },
			{ $set: { ...updatedProd } }
		);
		console.log(productoModificado);
		if (productoModificado.upsertedCount == 1) {
			return { _id };
		}
		return { mensaje: "no se pudo actualizar el producto" };
	} catch (e) {
		console.error("no se pudo actualizar el producto. " + e);
		return { mensaje: "no se pudo actualizar el producto", error: e };
	}
}
async function deleteProducto(id) {
	try {
		const productoBorrado = await esquemaProducto.deleteOne({ _id: id });
		console.log(productoBorrado);
		if (productoBorrado.deletedCount == 1) {
			return id;
		}
		return { mensaje: "no se pudo borrar el producto." };
	} catch (e) {
		console.error("no se pudo borrar el producto. " + e);
		return { mensaje: "no se pudo borrar el producto", error: e };
	}
}

module.exports = { getProducto, getProductos, createProducto, updateProducto, deleteProducto };
