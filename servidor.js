const contenedor = require("./ClaseContenedor");
const express = require("express");
const { Router } = express;
const path = require("path");

const app = express();
const router = Router();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);
app.use("/public", express.static(__dirname + "/public"));

async function test() {
	let Contenedor = new contenedor("productos");
	await Contenedor.deleteAll();
	await Contenedor.getData();

	await Contenedor.save({
		title: "agua",
		price: 50,
		thumbnail:
			"https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3040339_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fagua-mineral-bonaqua-sin-gas-botella-x-1500-cc%2F_%2FA-3040339-3040339-s&tbnid=aoOcdHz_p8IsyM&vet=12ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ..i&docid=8Fz2ltgcFLvLbM&w=600&h=600&q=agua%20botella&ved=2ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ",
	});

	await Contenedor.save({
		title: "coca-cola",
		price: 70,
		thumbnail:
			"https://www.google.com/imgres?imgurl=https%3A%2F%2Fvalsegura.com%2Fwp-content%2Fuploads%2F2016%2F02%2Fcc-33cl.jpg&imgrefurl=https%3A%2F%2Fvalsegura.com%2Fcatalogo-interactivo%2Fcoca-cola-iberian-partners%2Frefrescos-y-energeticas-coca-cola-iberian-partners%2Fcoca-cola-35-cl-vidrio%2F&tbnid=GQzfgq4hCRpgtM&vet=12ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ..i&docid=cNBoORWaldaZpM&w=800&h=800&q=coca%20botella&ved=2ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ",
	});

	await Contenedor.save({
		title: "cerveza",
		price: 80,
		thumbnail:
			"https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3100424_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fcerveza-imperial-rubia-botella-retornable-x-1000-cc%2F_%2FA-3100424-3100424-s&tbnid=PYnqob0ku3jQdM&vet=12ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ..i&docid=Qy4owft0rZ08BM&w=600&h=600&q=cerveza%20botella&ved=2ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ",
	});

	await Contenedor.save({
		title: "chocolate",
		price: 15,
		thumbnail:
			"https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Fvector-gratis%2Fbarra-chocolate-paquete-blanco_1308-57644.jpg%3Fw%3D2000&imgrefurl=https%3A%2F%2Fwww.freepik.es%2Ffotos-vectores-gratis%2Fbarra-de-chocolate-dibujo&tbnid=GUbZsCfISDGuDM&vet=12ahUKEwjrkqHk5Ij5AhUcu5UCHQcgCXYQMyhDegUIARCMAQ..i&docid=TgP874NDq-2bQM&w=1993&h=2000&q=chocolate&ved=2ahUKEwjrkqHk5Ij5AhUcu5UCHQcgCXYQMyhDegUIARCMAQ",
	});

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname + "/public/index.html"));
	});

	router.get("/", (req, res) => {
		try {
			Contenedor.getAll().then((resp) => {
				res.json(resp);
			});
		} catch (e) {
			res.json({ mensaje: "no se encontraron los productos", error: e });
		}
	});

	router.get("/:id", (req, res) => {
		try {
			let ID = req.params.id;
			Contenedor.getById(ID).then((resp) => {
				res.json(resp);
			});
		} catch (e) {
			res.json({ mensaje: "no se pudo buscar el producto.", error: e });
		}
	});

	router.post("/", (req, res) => {
		try {
			let nuevoProd = req.body;
			Contenedor.save(nuevoProd).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo agregar el producto.", error: e });
		}
	});

	router.put("/:id", async (req, res) => {
		try {
			let ID = req.params.id;
			let cambio = req.body;
			Contenedor.actualizar(ID, cambio).then((resp) => res.json(resp));
		} catch (e) {
			res.json({ mensaje: "no se pudo actualizar el producto", error: e });
		}
	});

	router.delete("/:id", async (req, res) => {
		try {
			let ID = req.params.id;
			await Contenedor.deleteById(ID).then((data) => res.json(data));
		} catch (e) {
			res.json({ error: e });
		}
	});

	const server = app.listen(PORT, () => {
		console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
	});
	server.on("error", (error) => console.log(`Error en el servidor: ${error}`));
}
test();
