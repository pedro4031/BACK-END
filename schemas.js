const normalizr = require('normalizr');
const schema = normalizr.schema;

const authorSchema = new schema.Entity('Author');

const textSchema = new schema.Entity('post');

const chat = new schema.Entity('posts', {
  mensajes: [
    {
      author: authorSchema,
      text: textSchema,
    },
  ],
});

module.exports = chat;
