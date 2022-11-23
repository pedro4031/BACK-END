const routerProductos = require("express").Router();
const controllers = require("../controllers/controllerProductos");
const middlewares = require("../middlewares/imports");
//ALMACEN
routerProductos.get(
	"/almacen",
	middlewares.checkAuthentication,
	middlewares.checkAdmin,
	controllers.getAlmacen
);

//GETALL
routerProductos.get("/", middlewares.checkAuthentication, controllers.getProds);

//GETBYID
routerProductos.get("/:id", middlewares.checkAuthentication, controllers.getByIdProd);

//POST PRODUCTO
routerProductos.post(
	"/",
	middlewares.checkAuthentication,
	middlewares.checkAdmin,
	controllers.agregarProd
);

//ACTUALIZAR PRODUCTO
routerProductos.put(
	"/:id",
	middlewares.checkAuthentication,
	middlewares.checkAdmin,
	controllers.actualizarProd
);

//BORRAR PRODUCTO
routerProductos.delete(
	"/:id",
	middlewares.checkAuthentication,
	middlewares.checkAdmin,
	controllers.eliminarProd
);

module.exports = routerProductos;
