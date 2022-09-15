//CONFIGURACION APP

const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let administrador = false;
function admin() {
	return administrador;
}
module.exports = admin;

//RUTAS de App
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

// Elegir que base de datos utilizar en cada ROUTER. Opciones: "MongoDB" o "FireBase".

const tipoCarrito = "FireBase";
const tipoProductos = "FireBase";

//PRENDER SERVER

const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en el servidor: ${error}`));

(async function rutasServer() {
	//RUTAS DE CARRITO Y PRODUCTOS

	await import(`./src/contenedores/Contenedor${tipoCarrito}.js`).then(({ routerCarrito }) => {
		app.use("/api/carrito", routerCarrito);
	});

	await import(`./src/contenedores/Contenedor${tipoProductos}.js`).then(({ routerProductos }) => {
		app.use("/api/productos", routerProductos);
	});

	//RUTAS NO DECLARADAS
	app.get("*", (req, res) => {
		let metodo = req.method;
		let ruta = req.originalUrl;
		res.json({ error: 404, descripcion: `ruta ${ruta} metodo ${metodo} no implementado.` });
	});

	app.post("*", (req, res) => {
		let metodo = req.method;
		let ruta = req.originalUrl;
		res.json({ error: 404, descripcion: `ruta ${ruta} metodo ${metodo} no implementado.` });
	});
})();
