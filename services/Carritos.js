const config = require("../config/config");
const { logger, loggerE } = require("../utils/loger");
const { sendMail, sendWpp } = require("../utils/nodemailerConfig");
const { carritoMongo, productosMongo } = require("../database/imports");
const Carritos = new carritoMongo();
const almacenProductos = new productosMongo();

//CREAR CARRITO
async function crearCarrito(id) {
	try {
		return Carritos.crear(id);
	} catch (e) {
		loggerE.error("No se pudo crear el carrito." + e);
		return { mensaje: "No se pudo crear el carrito.", error: e };
	}
}

//PAGINA MICARRITO
async function miCarrito(id) {
	try {
		let prods = await Carritos.getAll(id);
		let estado;
		prods.length > 0 ? (estado = true) : (estado = false);

		return { productos: prods, exists: estado };
	} catch (e) {
		logger.warn("carrito vacio/no se encontraron los productos. " + e);
		return { productos: [] };
	}
}

//VACIAR CARRITO
async function vaciarCarrito(id) {
	try {
		return Carritos.deleteAll(id);
	} catch (e) {
		loggerE.error("No se pudo vaciar el carrito." + e);
		return { mensaje: "No se pudo vaciar el carrito", error: e };
	}
}

//PRODUCTOS DEL CARRITO
async function productosCarrito(id) {
	try {
		return Carritos.getAll(id);
	} catch (e) {
		loggerE.error("No se pudieron encontrar los productos/carrito." + e);
		return { mensaje: "No se pudieron encontrar los productos/carrito.", error: e };
	}
}

//GUARDAR PRODUCTO EN CARRITO
async function guardarProdCarrito(idCart, idProd, cantProd) {
	try {
		let productoCart = await almacenProductos.getById(idProd);

		let prodCart = { ...productoCart["0"]._doc };
		prodCart.cantidad = cantProd;
		prodCart.precioTotal = parseFloat(cantProd * prodCart.precio);
		return Carritos.save(idCart, prodCart);
	} catch (e) {
		loggerE.error("No se pudo guardar el producto en el carrito." + e);
		return { mensaje: "No se pudo guardar el producto en el carrito", error: e };
	}
}

//BORRAR PRODUCTO DEL CARRITO
async function borrarProdCarrito(id, idProd) {
	try {
		let productosCarrito = await Carritos.getAll(id);
		let index = productosCarrito.findIndex((prod) => prod._id.toString() == idProd);
		if (index == -1) {
			return { mensaje: "producto no encontrado en carrito" };
		} else {
			productosCarrito.splice(index, 1);
			return Carritos.deleteById(id, productosCarrito);
		}
	} catch (e) {
		loggerE.error("No se pudo borrar el producto." + e);
		return { mensaje: "No se pudo borrar el producto.", error: e };
	}
}

//COMPRAR CARRITO
async function comprarCarrito(idCart, productos, cliente) {
	try {
		let resp = await Carritos.deleteAll(idCart);
		if (resp.mensaje == "carrito vaciado") {
			let cuerpoMail = productos.reduce(
				(cuerpo, datosProds) =>
					cuerpo +
					`<p>id: ${datosProds._id},nombre: ${datosProds.nombre},cantidad: ${datosProds.cantidad}</p>`,
				"<h3>Lista de productos pedidos:</h3>"
			);
			sendMail(`Nuevo pedido de ${cliente.usuario}-mail: ${cliente.username}.`, cuerpoMail);

			let cuerpoWpp = productos.reduce(
				(cuerpo, datosProds) =>
					cuerpo +
					`/id:${datosProds._id}, nombre: ${datosProds.nombre}, cantidad: ${datosProds.cantidad}/ `,
				`Nuevo pedido de ${cliente.usuario}-mail: ${cliente.username}. `
			);
			let numCliente = `${cliente.prefijo}${cliente.telefono}`;
			sendWpp(config.TELEFONO_NOTIFICACIONES, cuerpoWpp);
			sendWpp(numCliente, "compra realizada. Pedido en proceso");
			return { mensaje: "compra realizada" };
		} else {
			return { mensaje: "no se logro la compra" };
		}
	} catch (e) {
		loggerE.error("No se pudo vaciar el carrito." + e);
		return { mensaje: "No se pudo vaciar el carrito", error: e };
	}
}

module.exports = {
	crearCarrito,
	miCarrito,
	vaciarCarrito,
	productosCarrito,
	guardarProdCarrito,
	borrarProdCarrito,
	comprarCarrito,
};
