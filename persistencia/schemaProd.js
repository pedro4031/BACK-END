const { Schema, model } = require("mongoose");

const ProductoSchema = new Schema(
	{
		nombre: { type: String, required: true, max: 100 },
		precio: { type: Number, required: true },
		stock: { type: Number, required: true },
		foto: { type: String, required: true },
	},
	{ versionKey: false }
);

const esquemaProducto = model("producto", ProductoSchema);

module.exports = esquemaProducto;
