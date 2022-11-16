const config = require("./config");
const passport = require("./passportConfig");
const flash = require("connect-flash");
const compression = require("compression");
const { loggerE, logger } = require("./loger");
//Cluster
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
//Mongo
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
//Routers
const routerFaker = require("./routers/faker");
const routerSession = require("./routers/sesiones");
const routerInfo = require("./routers/info");
const routerProductos = require("./routers/productos");
const routerCarritos = require("./routers/carritos");
//Express
const express = require("express");
const app = express();

const { engine } = require("express-handlebars");
const session = require("express-session");

//Configuraciones App general
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/carritos", express.static("public"));
app.use("/productos", express.static("public"));
app.use(flash());
app.enable("trust proxy");

//Configuracion Mongoose - verificar que se pueda conectar a la base de datos.
mongoose
	.connect(config.MONGODB_URL)
	.then(() => logger.info("mongoDB conectado"))
	.catch((e) => {
		loggerE.error(`no se pudo conectar a la base de datos. ${e}`);
		throw new Error("no se pudo conectar a la base de datos");
	});

//Configuracion App motor de plantilla
app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
	"hbs",
	engine({
		extname: ".hbs",
		defaultLayout: "index.hbs",
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
	})
);

//Configuracion App sesiones
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: config.MONGODB_URL,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),

		secret: config.SESSION_CLAVE,

		cookie: {
			httpOnly: false,
			secure: false,
			maxAge: 600000,
		},

		resave: true,
		saveUninitialized: false,
		rolling: true,
	})
);

// INICIAR PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//Socket.io
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

async function test() {
	//RUTAS
	app.use("/productos", routerProductos);
	app.use("/carritos", routerCarritos);
	app.use(routerFaker);
	app.use(routerInfo);
	app.use(routerSession);

	//Prender servidor en diferentes modos

	switch (config.MODO) {
		case undefined:
		case "fork":
			httpServer.listen(config.PORT, () => {
				logger.info(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
			});
			break;
		case "cluster":
			if (cluster.isMaster) {
				logger.info(`Master ${process.pid} is running`);

				try {
					for (let i = 0; i < numCPUs; i++) {
						cluster.fork();
					}

					cluster.on("exit", (worker, code, signal) => {
						cluster.fork();
						logger.info(`worker ${worker.process.pid} died`);
					});
				} catch (e) {
					loggerE.error(`no se pudiern crear los cluster. ${e}`);
				}
			} else {
				httpServer.listen(config.PORT, () => {
					logger.info(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
					logger.info(`Worker N:${process.pid}`);
				});
			}

			break;
		default:
			throw new Error("No se reconoció el modo para iniciar. Intente con otro modo.");
			break;
	}
}
test();
