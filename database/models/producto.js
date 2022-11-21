const { Schema, model } = require("mongoose");

const ProductoSchema = new Schema(
	{
		timestamp: { type: String, required: true },
		categoria: { type: String, required: true },
		nombre: { type: String, required: true, max: 100 },
		descripcion: { type: String, required: true, max: 100 },
		codigo: { type: String, required: true, max: 100 },
		foto: { type: String, required: true },
		precio: { type: Number, required: true },
		stock: { type: Number, required: true },
	},
	{ versionKey: false }
);

const esquemaProducto = model("producto", ProductoSchema);

module.exports = esquemaProducto;
