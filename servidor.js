const contenedor = require('./ClaseContenedor');
const express = require('express');
const { Router } = express;
const { engine } = require('express-handlebars');
const path = require('path');

const { faker } = require('@faker-js/faker');

//Express
const app = express();
const router = Router();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/productos', router);

//Socket.io
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

//Knex y opciones de base de datos
const { optionsM } = require('./options/mariaDB.js');
const knexM = require('knex')(optionsM);
const { optionsQ } = require('./options/sQlite3.js');
const knexQ = require('knex')(optionsQ);

async function test() {
  let Chat = new contenedor('chat', knexQ);
  await Chat.createTabla('c');

  let Productos = new contenedor('productos', knexQ);
  await Productos.createTabla('p');

  app.get('/', (req, res) => {
    res.render('Elementos', { root: __dirname });
  });

  app.get('/api/productos-test', (req, res) => {
    let productosRandom = [];

    for (let i = 0; i < 5; i++) {
      let prod = {};
      const randomName = faker.commerce.product();
      const randomPrice = faker.commerce.price(50, 10000);
      const randomFoto = faker.image.food(150, 100, true);
      prod.name = randomName;
      prod.price = randomPrice;
      prod.foto = randomFoto;
      productosRandom.push(prod);
    }
    res.json(productosRandom);
  });

  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${httpServer.address().port}`);
  });

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
