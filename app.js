const createError = require("http-errors");
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const {
	getProducto,
	getProductos,
	createProducto,
	updateProducto,
	deleteProducto,
} = require("./persistencia/mongoProductos");

const mongoose = require("mongoose");
mongoose
	.connect("mongodb+srv://pedro4031:coder123@cluster0.cqyzzdp.mongodb.net/test2")
	.then(() => console.log("mongoDB conectado"))
	.catch((e) => {
		console.error(`no se pudo conectar a la base de datos. ${e}`);
		throw new Error("no se pudo conectar a la base de datos");
	});

const schema = buildSchema(`
  type producto {
    _id: ID!
    nombre: String,
    precio: Int,
	stock: Int,
	foto: String
  }
  input productoInput {
    nombre: String,
    precio: Int,
	stock: Int,
	foto: String
  }
  type Query {
    getProducto(_id: ID!): producto,
    getProductos: [producto],
  }
  type Mutation {
    createProducto(datos: productoInput): producto
    updateProducto(_id: ID!, datos: productoInput):producto,
    deleteProducto(_id: ID!): producto,
  }
`);
//import crypto from 'crypto';

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/administracion");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
	"hbs",
	engine({
		extname: ".hbs",
		defaultLayout: "layout.hbs",
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
	})
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/administrar", adminRouter);
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: {
			getProductos,
			getProducto,
			createProducto,
			updateProducto,
			deleteProducto,
		},
		graphiql: true,
	})
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
