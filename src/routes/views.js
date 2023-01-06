const routerViews = require("express").Router();
const controllers = require("../controllers/controllerViews");
const middlewares = require("../middlewares/imports");

//PAGINA BIENVENIDA
routerViews.get("/bienvenida", controllers.getBienvenida);

//PAGINA INDEX
routerViews.get("/", middlewares.checkAuthentication, controllers.getRoot);

//PAGINA PERFIL
routerViews.get("/perfil", middlewares.checkAuthentication, controllers.getPerfil);

//PAGINA INFORMACION DEL PROCESO
routerViews.get("/info", middlewares.checkAuthentication, controllers.getInfo);

//FAIL ROUTES
routerViews.get("*", controllers.getFailRoute);
routerViews.post("*", controllers.getFailRoute);

module.exports = routerViews;
