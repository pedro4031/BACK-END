const contenedor = require('./ClaseContenedor');
const express = require('express');
const { Router } = express;
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const router = Router();
const PORT = 8080;

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/productos', router);

async function test() {
  let chat = new contenedor('chat');
  await chat.deleteAll();
  await chat.getData();

  let Contenedor = new contenedor('productos');
  await Contenedor.deleteAll();
  await Contenedor.getData();

  app.get('/', (req, res) => {
    res.render('Elementos', { root: __dirname });
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

  io.on('connection', (socket) => {
    Contenedor.getAll().then((data) => io.sockets.emit('listaProds', data));
    chat.getAll().then((data) => io.sockets.emit('chat', data));
    socket.on('nuevoProd', (data) => {
      Contenedor.save(data).then((datos) => Contenedor.getAll().then((data) => io.sockets.emit('listaProds', data)));
    });

    socket.on('nuevoMsg', (data) => {
      chat.save(data).then((datos) => chat.getAll().then((data) => io.sockets.emit('chat', data)));
    });
  });
}
test();
