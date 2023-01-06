const { Schema, model } = require("mongoose");

const CarritoSchema = new Schema(
	{
		mail: { type: String, required: true },
		timestamp: { type: String, required: true },
		productos: [],
		direccion: { type: String, required: true },
	},
	{ versionKey: false }
);

const esquemaCarrito = model("carritos", CarritoSchema);

module.exports = esquemaCarrito;
