const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
	username: { type: String, required: true, max: 100 },
	password: { type: String, required: true, max: 100 },
	usuario: { type: String, required: true, max: 100 },
	direccion: { type: String, required: true, max: 100 },
	edad: { type: Number, required: true, max: 150 },
	prefijo: { type: Number, required: true, max: 998 },
	telefono: { type: Number, required: true },
	avatar: { type: String, required: true },
});

const esquemaUsuarios = model("usuarios", UsuarioSchema);

module.exports = esquemaUsuarios;
