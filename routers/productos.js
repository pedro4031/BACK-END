const routes = require("./funciones");
const routerProductos = require("express").Router();

//ALMACEN
routerProductos.get("/almacen", routes.checkAuthentication, routes.checkAdmin, routes.getAlmacen);

//GETALL
routerProductos.get("/", routes.getAllProds);

//GETBYID
routerProductos.get("/:id", routes.getByIdProd);

//POST PRODUCTO
routerProductos.post("/", routes.checkAuthentication, routes.checkAdmin, routes.postProd);

//ACTUALIZAR PRODUCTO
routerProductos.put("/:id", routes.checkAuthentication, routes.checkAdmin, routes.updateProd);

//BORRAR PRODUCTO
routerProductos.delete("/:id", routes.checkAuthentication, routes.checkAdmin, routes.deleteProd);

module.exports = routerProductos;
