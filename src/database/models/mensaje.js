const { Schema, model } = require("mongoose");

const ChatSchema = new Schema(
	{
		sender: { type: String, required: true },
		receiver: { type: String, required: true },
		timestamp: { type: Date, required: true },
		mensaje: { type: String, required: true },
	},
	{ versionKey: false }
);

const esquemaChat = model("chats", ChatSchema);

module.exports = esquemaChat;
