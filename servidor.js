require('dotenv').config();
const contenedor = require('./ClaseContenedor');
const path = require('path');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const routerFaker = require('./routers/faker');
const routerSession = require('./routers/sesiones');
const passport = require('./passportConfig');
const flash = require('connect-flash');
//Express
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const session = require('express-session');
const PORT = 8080;

//Configuraciones App general
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//Configuracion Mongoose - verificar que se pueda conectar a la base de datos.

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Base de datos mongoDB conectada'))
  .catch((e) => {
    console.error(e);
    throw new Error('no se pudo conectar a la base de datos');
  });

//Configuracion App sesiones
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),

    secret: process.env.SESSION_CLAVE,

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

//Configuracion App motor de plantilla
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

//Socket.io
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

//Knex y opciones de base de datos
const { optionsM } = require('./options/mariaDB.js');
const knexM = require('knex')(optionsM);
const { optionsQ } = require('./options/sQlite3.js');
const knexQ = require('knex')(optionsQ);

async function test() {
  //creacion de contenedores/tablas
  let Chat = new contenedor('chat', knexQ);
  await Chat.createTabla('c');

  let Productos = new contenedor('productos', knexQ);
  await Productos.createTabla('p');

  //RUTAS

  app.use(routerFaker);
  app.use(routerSession);

  //Prender servidor
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
  });

  //socket.io conexiones
  io.on('connection', async (socket) => {
    await Productos.getAll('p').then((data) => {
      io.sockets.emit('listaProds', data);
    });
    await Chat.getAll('c').then((data) => io.sockets.emit('chat', data));
    socket.on('nuevoProd', (data) => {
      Productos.save(data).then((datos) => Productos.getAll('p').then((data) => io.sockets.emit('listaProds', data)));
    });

    socket.on('nuevoMsg', async (data) => {
      await Chat.save(data).then((datos) => Chat.getAll('c').then((data) => io.sockets.emit('chat', data)));
    });
  });
}
test();
