require('dotenv').config();
const yargs = require('yargs/yargs')(process.argv.slice(2));
const args = yargs.argv;

module.exports = {
  MODO: args.modo || undefined,

  PORT: args.PORT || 8080,

  MONGODB_URL: process.env.MONGODB_URL,

  SESSION_CLAVE: process.env.SESSION_CLAVE || 'clave123',

  OPTIONS_M: JSON.parse(process.env.OPTIONS_M),

  OPTIONS_Q: JSON.parse(process.env.OPTIONS_Q),
};
