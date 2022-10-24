const config = require('./config');
const contenedor = require('./ClaseContenedor');
const path = require('path');
const passport = require('./passportConfig');
const flash = require('connect-flash');

//Cluster
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//Mongo
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
//Routers
const routerFaker = require('./routers/faker');
const routerSession = require('./routers/sesiones');
const routerFork = require('./routers/fork');
//Express
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const session = require('express-session');

//Configuraciones App general
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//Configuracion Mongoose - verificar que se pueda conectar a la base de datos.

mongoose
  .connect(config.MONGODB_URL)
  .then(() => console.log('mongoDB conectado'))
  .catch((e) => {
    console.error(e);
    throw new Error('no se pudo conectar a la base de datos');
  });

//Configuracion App sesiones
app.use(
  session({
    store: MongoStore.create({ mongoUrl: config.MONGODB_URL }),

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

const knexM = require('knex')(config.OPTIONS_M);

const knexQ = require('knex')(config.OPTIONS_Q);

async function test() {
  //creacion de contenedores/tablas
  let Chat = new contenedor('chat', knexQ);
  await Chat.createTabla('c');

  let Productos = new contenedor('productos', knexQ);
  await Productos.createTabla('p');

  //RUTAS

  app.use(routerFaker);
  app.use(routerFork);
  app.use(routerSession);

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

  //Prender servidor en diferentes modos

  switch (config.MODO) {
    case undefined:
    case 'fork':
      httpServer.listen(config.PORT, () => {
        console.log(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
      });
      break;
    case 'cluster':
      if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
          cluster.fork();
          console.log(`worker ${worker.process.pid} died`);
        });
      } else {
        httpServer.listen(config.PORT, () => {
          console.log(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
          console.log(`Worker N:${process.pid}`);
        });
      }

      break;
    default:
      throw new Error('No se reconoció el modo para iniciar. Intente con otro modo.');
      break;
  }
}
test();
