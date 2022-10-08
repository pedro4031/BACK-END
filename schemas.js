const normalizr = require('normalizr');
const schema = normalizr.schema;
const mongoose = require('mongoose');

const authorSchema = new schema.Entity('Author', {}, { idAttribute: 'mail' });

const textSchema = new schema.Entity('post');

const chat = new schema.Entity('posts', {
  mensajes: [
    {
      author: authorSchema,
      text: textSchema,
    },
  ],
});

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
});

const Usuarios = mongoose.model('usuarios', UsuarioSchema);

module.exports = { chat, Usuarios };
