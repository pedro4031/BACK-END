const routerCarritos = require("express").Router();
const controllers = require("../controllers/controllerCarritos");
const middlewares = require("../middlewares/imports");
//CREAR CARRITO
routerCarritos.post("/", middlewares.checkAuthentication, controllers.createCart);

//MI CARRITO
routerCarritos.get("/miCarrito", middlewares.checkAuthentication, controllers.miCart);

//VACIAR CARRITO
routerCarritos.delete("/", middlewares.checkAuthentication, controllers.vaciarCart);

//PRODUCTOS DEL CARRITO
routerCarritos.get("/productos", middlewares.checkAuthentication, controllers.getCart);

//GUARDAR PRODUCTO EN CARRITO
routerCarritos.post("/productos", middlewares.checkAuthentication, controllers.addCart);

//BORRAR PRODUCTO DEL CARRITO
routerCarritos.delete(
	"/productos/:id_prod",
	middlewares.checkAuthentication,
	controllers.deleteCart
);

//COMPRAR CARRITO
routerCarritos.post("/comprar", middlewares.checkAuthentication, controllers.buyCart);

module.exports = routerCarritos;
