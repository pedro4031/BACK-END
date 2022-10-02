const contenedor = require('./ClaseContenedor');
const path = require('path');
const MongoStore = require('connect-mongo');
const routerFaker = require('./routers/faker');
const routerSession = require('./routers/sesiones');
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

//Configuracion App sesiones
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://pedro4031:clave123@cluster0.cqyzzdp.mongodb.net/test',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: 'claveSecreta123',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

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

//Chequear sesion
function checkSession(req, res, next) {
  if (req.session?.nombre) {
    next();
  } else {
    res.redirect('/login');
  }
}

async function test() {
  //creacion de contenedores/tablas
  let Chat = new contenedor('chat', knexQ);
  await Chat.createTabla('c');

  let Productos = new contenedor('productos', knexQ);
  await Productos.createTabla('p');

  //RUTAS
  app.get('/', checkSession, (req, res) => {
    const nombre = req.session?.nombre;
    res.render('Elementos', { root: __dirname, nombre });
  });

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
