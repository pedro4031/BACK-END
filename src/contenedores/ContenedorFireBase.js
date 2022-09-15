const { carritoFireBase, productosFireBase } = require("../daos/imports");
const express = require("express");
const routerCarrito = express.Router();
const routerProductos = express.Router();

//ROUTERS PRODUCTOS

const almacenProductos = new productosFireBase();

//GETALL
routerProductos.get("/", (req, res) => {
	try {
		almacenProductos.getAll().then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "no se encontraron los productos", error: e });
	}
});

//GETBYID
routerProductos.get("/:id", (req, res) => {
	try {
		let { id } = req.params;
		almacenProductos.getById(id).then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "no se pudo buscar el producto.", error: e });
	}
});

//POST PRODUCTO
routerProductos.post(
	"/",
	(req, res, next) => {
		let admin = require("../../server");

		if (!admin()) {
			let metodo = req.method;
			let ruta = req.originalUrl;
			res.json({ error: 401, descripcion: `ruta ${ruta} metodo ${metodo} no autorizada.` });
		} else {
			next();
		}
	},

	async (req, res) => {
		try {
			let nuevoProd = req.body;
			let nuevoProducto = {
				timestamp: nuevoProd.timestamp,
				nombre: nuevoProd.nombre,
				descripcion: nuevoProd.descripcion,
				codigo: nuevoProd.codigo,
				foto: nuevoProd.foto,
				precio: nuevoProd.precio,
				stock: nuevoProd.stock,
			};

			almacenProductos.save(nuevoProducto).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo agregar el producto.", e });
		}
	}
);

//ACTUALIZAR PRODUCTO
routerProductos.put(
	"/:id",
	(req, res, next) => {
		let admin = require("../../server");
		if (!admin()) {
			let metodo = req.method;
			let ruta = req.originalUrl;
			res.json({ error: 401, descripcion: `ruta ${ruta} metodo ${metodo} no autorizada.` });
		} else {
			next();
		}
	},
	async (req, res) => {
		try {
			let { id } = req.params;
			const cambio = req.body;

			let nuevoProd = {};

			cambio.hasOwnProperty("timestamp") && (nuevoProd.timestamp = cambio.timestamp);
			cambio.hasOwnProperty("nombre") && (nuevoProd.nombre = cambio.nombre);
			cambio.hasOwnProperty("descripcion") && (nuevoProd.descripcion = cambio.descripcion);
			cambio.hasOwnProperty("codigo") && (nuevoProd.codigo = cambio.codigo);
			cambio.hasOwnProperty("foto") && (nuevoProd.foto = cambio.foto);
			cambio.hasOwnProperty("precio") && (nuevoProd.precio = cambio.precio);
			cambio.hasOwnProperty("stock") && (nuevoProd.stock = cambio.stock);
			Object.entries(nuevoProd).length === 0
				? res.json({ mensaje: "sin datos para actualizar" })
				: await almacenProductos.actualizar(id, nuevoProd).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo actualizar el producto", error: e });
		}
	}
);

//BORRAR PRODUCTO
routerProductos.delete(
	"/:id",
	(req, res, next) => {
		let admin = require("../../server");
		if (!admin()) {
			let metodo = req.method;
			let ruta = req.originalUrl;
			res.json({ error: 401, descripcion: `ruta ${ruta} metodo ${metodo} no autorizada.` });
		} else {
			next();
		}
	},
	async (req, res) => {
		try {
			let { id } = req.params;
			almacenProductos.deleteById(id).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo borrar el producto", error: e });
		}
	}
);

//ROUTERS CARRITO

const Carritos = new carritoFireBase();

//CREAR CARRITO
routerCarrito.post("/", async (req, res) => {
	try {
		Carritos.crear().then((resp) => res.json(resp));
	} catch (error) {
		res.json({ mensaje: "No se pudo crear el carrito.", error: error });
	}
});

//BORRAR CARRITO
routerCarrito.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		Carritos.deleteAll(id).then((resp) => res.json(resp));
	} catch (error) {
		res.json({ mensaje: "No se pudo eliminar el carrito", error: error });
	}
});

//PRODUCTOS DEL CARRITO
routerCarrito.get("/:id/productos", async (req, res) => {
	try {
		const { id } = req.params;
		Carritos.getAll(id).then((resp) => res.json(resp));
	} catch (error) {
		res.json({ mensaje: "No se pudieron encontrar los productos/carrito.", error: error });
	}
});

//GUARDAR PRODUCTO EN CARRITO
routerCarrito.post("/:id/productos", (req, res) => {
	try {
		const idCart = req.params.id;
		const idProd = req.body.idProd;
		almacenProductos.getById(idProd).then((prod) => {
			Carritos.save(idCart, prod).then((resp) => {
				res.json(resp);
			});
		});
	} catch (error) {
		res.json({ mensaje: "No se pudo guardar el producto", error: error });
	}
});

//BORRAR PRODUCTO DEL CARRITO
routerCarrito.delete("/:id/productos/:idProd", async (req, res) => {
	try {
		const { id, idProd } = req.params;
		Carritos.deleteById(id, idProd).then((resp) => {
			res.json(resp);
		});
	} catch (error) {
		res.json({ mensaje: "No se pudo borrar el producto.", error: error });
	}
});

module.exports = { routerCarrito, routerProductos };
