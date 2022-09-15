const { Schema, model } = require("mongoose");

const CarritoSchema = new Schema(
	{
		timestamp: { type: String, required: true },
		productos: [],
	},
	{ versionKey: false }
);

const esquemaCarrito = model("carrito", CarritoSchema);

module.exports = esquemaCarrito;
