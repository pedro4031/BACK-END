const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrdenSchema = new Schema(
	{
		_id: Number,
		timestamp: { type: Date, required: true },
		productos: [],
		estado: { type: String, default: "generada" },
		mail: { type: String, required: true },
		precioTotal: { type: Number, required: true },
	},
	{ _id: false, versionKey: false }
);

OrdenSchema.plugin(AutoIncrement);
const esquemaOrden = model("ordenes", OrdenSchema);

module.exports = esquemaOrden;
