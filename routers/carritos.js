const routes = require("./funciones");
const routerCarritos = require("express").Router();

//MI CARRITO
routerCarritos.get("/miCarrito", routes.miCarrito);

//CREAR CARRITO
routerCarritos.post("/", routes.createCart);

//VACIAR CARRITO
routerCarritos.delete("/", routes.deleteCart);

//PRODUCTOS DEL CARRITO
routerCarritos.get("/productos", routes.cartProds);

//GUARDAR PRODUCTO EN CARRITO
routerCarritos.post("/productos", routes.postCartProd);

//BORRAR PRODUCTO DEL CARRITO
routerCarritos.delete("/productos/:id_prod", routes.deleteCartProd);

//COMPRAR CARRITO
routerCarritos.post("/comprar", routes.comprar);

module.exports = routerCarritos;
