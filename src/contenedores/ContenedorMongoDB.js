const { carritoMongo, productosMongo } = require("../daos/imports");
const express = require("express");
const { Router } = express;
const routerCarrito = Router();
const routerProductos = Router();

//ROUTERS PRODUCTOS

const almacenProductos = new productosMongo();

//GETALL
routerProductos.get("/", async (req, res) => {
	try {
		await almacenProductos.getAll().then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "no se encontraron los productos", error: e });
	}
});

//GETBYID
routerProductos.get("/:id", async (req, res) => {
	try {
		let { id } = req.params;
		await almacenProductos.getById(id).then((resp) => res.json(resp));
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

			await almacenProductos.save(nuevoProducto).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo agregar el producto.", error: e });
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
			const ID = req.params.id;
			await almacenProductos.deleteById(ID).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo borrar el producto", error: e });
		}
	}
);

//ROUTERS CARRITO

const Carritos = new carritoMongo();

//CREAR CARRITO
routerCarrito.post("/", async (req, res) => {
	try {
		await Carritos.crear().then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "No se pudo crear el carrito.", error: e });
	}
});

//BORRAR CARRITO
routerCarrito.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await Carritos.deleteAll(id).then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "No se pudo eliminar el carrito", error: e });
	}
});

//PRODUCTOS DEL CARRITO
routerCarrito.get("/:id/productos", async (req, res) => {
	try {
		const { id } = req.params;
		Carritos.getAll(id).then((resp) => res.json(resp));
	} catch (e) {
		res.json({ mensaje: "No se pudieron encontrar los productos/carrito.", error: e });
	}
});

//GUARDAR PRODUCTO EN CARRITO
routerCarrito.post("/:id/productos", async (req, res) => {
	try {
		const idCart = req.params.id;
		const idProd = req.body.idProd;
		almacenProductos.getById(idProd).then((prod) => {
			prod[0]["_id"] = JSON.stringify(prod[0]["_id"]);
			Carritos.save(idCart, ...prod).then((resp) => res.json(resp));
		});
	} catch (e) {
		res.json({ mensaje: "No se pudo guardar el producto en el carrito", error: e });
	}
});

//BORRAR PRODUCTO DEL CARRITO
routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
	try {
		const { id, id_prod } = req.params;
		Carritos.deleteById(id, id_prod).then((resp) => {
			res.json(resp);
		});
	} catch (e) {
		res.json({ mensaje: "No se pudo borrar el producto.", error: e });
	}
});

module.exports = { routerCarrito, routerProductos };
