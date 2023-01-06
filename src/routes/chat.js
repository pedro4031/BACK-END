const routerChat = require("express").Router();
const controllers = require("../controllers/controllerChat");
const middlewares = require("../middlewares/imports");

//PAGINA CHAT
routerChat.get("/chat", middlewares.checkAuthentication, controllers.getChat);

//MENSAJES PROPIOS
routerChat.get("/chat/:usuario", middlewares.checkAuthentication, controllers.getUserMsg);

//MENSAJES
routerChat.post("/getmessages", middlewares.checkAuthentication, controllers.getMessages);

//USUARIOS
routerChat.get(
	"/getusuarios",
	middlewares.checkAuthentication,
	middlewares.checkAdmin,
	controllers.getUsuarios
);

module.exports = routerChat;
