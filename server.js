const carritos = require("./ClaseCarritos");
const contenedor = require("./ClaseContenedor");

const express = require("express");
const { Router } = express;

const app = express();
const router = Router();
const carrito = Router();
const PORT = 8080;
let cantCarritos = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/public", express.static(__dirname + "/public"));

app.use("/api/productos", router);
app.use("/api/carrito", carrito);

let administrador = false;

async function test() {
	app.get("/", (req, res) => {
		res.json({ mensaje: "Ingrese ruta en el navegador..." });
	});

	app.get("/activarAdmin/:estado", (req, res) => {
		let { estado } = req.params;
		console.log(estado);
		switch (estado) {
			case "1":
				administrador = true;
				res.json({ mensaje: "modo Administrador activado." });
				break;
			case "0":
				administrador = false;
				res.json({ mensaje: "modo Administrador desactivado." });
				break;
			default:
				res.json({ mensaje: "Valor ingresado no válido." });
				break;
		}
	});

	// INICIO DE PRODUCTOS

	const Productos = new contenedor("productos");
	await Productos.deleteAll();
	await Productos.getData();

	await Productos.save({
		timestamp: new Date(),
		nombre: "Remera",
		descripcion: "Remera roja DC",
		codigo: 5656,
		foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmSS4501QFV5BetHlf9uPGnZeOxH231VmJQw&usqp=CAU",
		precio: 20,
		stock: 65,
	});

	await Productos.save({
		timestamp: new Date(),
		nombre: "Vino",
		descripcion: "Vino de 20 años",
		codigo: 5558,
		foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Xzrn56RqNVffWt25BwpgROIBmuriNRc1uw&usqp=CAU",
		precio: 559,
		stock: 7,
	});

	await Productos.save({
		timestamp: new Date(),
		nombre: "Auto",
		descripcion: "Auto de juguetes HotWheels",
		codigo: 2235,
		foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9-bBGOBfnjrNYOXqgb3KuPaQIA1vcXD5ong&usqp=CAU",
		precio: 7,
		stock: 78,
	});

	await Productos.save({
		timestamp: new Date(),
		nombre: "Coca-cola",
		descripcion: "Coca cola de 1,5 L",
		codigo: 7423,
		foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGt_-6xuzojzIJ5KZ9xCzCA_b6pLDmdfUSA&usqp=CAU",
		precio: 25,
		stock: 33,
	});

	await Productos.save({
		timestamp: new Date(),
		nombre: "TV",
		descripcion: "Television 55 pulgadas",
		codigo: 9898,
		foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcKF_x5vStRGC6Y341mm7znyJSKLMvNVHhRAAnORH99ISzmspvsjEK_M8G5_0rzYviwg&usqp=CAU",
		precio: 4000,
		stock: 44,
	});

	router.get("/", (req, res) => {
		try {
			Productos.getAll().then((resp) => {
				res.json(resp);
			});
		} catch (e) {
			res.json({ mensaje: "no se encontraron los productos", error: e });
		}
	});

	router.get("/:id", (req, res) => {
		try {
			let { id } = req.params;
			Productos.getById(id).then((resp) => {
				res.json(resp);
			});
		} catch (e) {
			res.json({ mensaje: "no se pudo buscar el producto.", error: e });
		}
	});

	router.post(
		"/",
		(req, res, next) => {
			if (!administrador) {
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
				await Productos.save(nuevoProd).then((resp) => res.json(resp));
			} catch (e) {
				res.json({ mensaje: "no se pudo agregar el producto.", error: e });
			}
		}
	);

	router.put(
		"/:id",
		(req, res, next) => {
			if (!administrador) {
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
				let cambio = req.body;
				Productos.actualizar(id, cambio).then((resp) => res.json(resp));
			} catch (e) {
				res.json({ mensaje: "no se pudo actualizar el producto", error: e });
			}
		}
	);

	router.delete(
		"/:id",
		(req, res, next) => {
			if (!administrador) {
				let metodo = req.method;
				let ruta = req.originalUrl;
				res.json({ error: 401, descripcion: `ruta ${ruta} metodo ${metodo} no autorizada.` });
			} else {
				next();
			}
		},
		async (req, res) => {
			try {
				let ID = req.params.id;
				await Productos.deleteById(ID).then((data) => res.json(data));
			} catch (e) {
				res.json({ error: e });
			}
		}
	);

	// FIN DE PRODUCTOS

	//INICIO DE CARRITO

	const Carritos = new carritos();

	carrito.post("/", async (req, res) => {
		await Carritos.crear(cantCarritos).then((resp) => {
			cantCarritos++;
			res.json(resp);
		});
	});

	carrito.delete("/:id", async (req, res) => {
		const { id } = req.params;
		await Carritos.deleteAll(id).then((resp) => res.json(resp));
	});
	carrito.get("/:id/productos", async (req, res) => {
		const { id } = req.params;
		await Carritos.getAll(id).then((resp) => {
			res.json(resp);
		});
	});
	carrito.post("/:id/productos", async (req, res) => {
		const idCart = req.params.id;
		const IdProd = req.body.idProd;

		await Productos.getById(IdProd).then((prod) =>
			Carritos.save(idCart, prod).then((resp) => res.json(resp))
		);
	});
	carrito.delete("/:id/productos/:id_prod", async (req, res) => {
		const { id, id_prod } = req.params;

		await Carritos.deleteById(id, id_prod).then((resp) => res.json(resp));
	});

	//FIN DE CARRITO

	app.all("*", (req, res) => {
		let metodo = req.method;
		let ruta = req.originalUrl;
		res.json({ error: 404, descripcion: `ruta ${ruta} metodo ${metodo} no implementado.` });
	});

	//PRENDER SERVER
	const server = app.listen(PORT, () => {
		console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
	});
	server.on("error", (error) => console.log(`Error en el servidor: ${error}`));
}
test();
