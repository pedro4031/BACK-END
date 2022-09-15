//productos y carrito firebase
const carritoFireBase = require("./carritos/CarritosFireBase");
const productosFireBase = require("./productos/ProductosFireBase");

//productos y carrito mongoDB
const carritoMongo = require("./carritos/CarritosMongoDB");
const productosMongo = require("./productos/ProductosMongoDB");

module.exports = { carritoFireBase, carritoMongo, productosFireBase, productosMongo };
