const fs = require("fs");

class carritos {
	constructor() {
		this.carrito = `Carritos`;
	}

	async crear(num) {
		try {
			let date = new Date();
			await fs.promises.writeFile(
				`Carrito${num}`,
				JSON.stringify({ id: num, timestamp: date, productos: [] })
			);
			return { IdCarrito: num };
		} catch (error) {
			return { mensaje: "No se pudo crear el carrito.", error: error };
		}
	}

	async deleteAll(id) {
		try {
			await fs.promises.unlink(`Carrito${id}`, (error) => {
				if (error) {
					return { mensaje: "No se pudo borrar el carrito", error: error };
				}
			});
			return { mensaje: "Carrito borrado." };
		} catch (error) {
			return { mensaje: "No se encontró el carrito.", error: error };
		}
	}

	async getAll(id) {
		try {
			let cartJ = await fs.promises.readFile(`Carrito${id}`, "utf-8");
			let cart = JSON.parse(cartJ);
			return cart.productos;
		} catch (error) {
			return { mensaje: "No se pudo encontrar el carrito", error: error };
		}
	}

	async save(id, Prod) {
		try {
			let cartJ = await fs.promises.readFile(`Carrito${id}`, "utf-8");
			let cart = JSON.parse(cartJ);
			cart.productos = [...cart.productos, Prod];
			await fs.promises.writeFile(`Carrito${id}`, JSON.stringify(cart));
			return { mensaje: "Producto guardado." };
		} catch (e) {
			return { mensaje: "Ocurrió un error.", error: error };
		}
	}

	async deleteById(id, prodId) {
		try {
			let cartJ = await fs.promises.readFile(`Carrito${id}`, "utf-8");
			let cart = JSON.parse(cartJ);
			let indice = cart.productos.findIndex((prod) => prod.id == prodId);
			if (indice != -1) {
				cart.productos.splice(indice, 1);

				await fs.promises.writeFile(`Carrito${id}`, JSON.stringify(cart));
				return { mensaje: "producto eliminado" };
			} else return { mensaje: "ID incorrecta. producto no encontrado." };
		} catch (error) {
			return { mensaje: "No se pudo borrar el producto.", error: error };
		}
	}
}

module.exports = carritos;
