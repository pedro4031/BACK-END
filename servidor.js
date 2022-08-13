const contenedor = require('./ClaseContenedor');
const express = require('express');
const { Router } = express;
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const router = Router();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/productos', router);

async function test() {
  let Contenedor = new contenedor('productos');
  await Contenedor.deleteAll();
  await Contenedor.getData();

  app.get('/', (req, res) => {
    res.render('formulario');
  });

  router.get('/', (req, res) => {
    try {
      Contenedor.getAll().then((resp) => {
        let cond;
        resp.length > 0 ? (cond = true) : (cond = false);
        res.render('tabla', { productos: resp, mostrar: cond });
      });
    } catch (e) {
      res.json({ mensaje: 'no se encontraron los productos', error: e });
    }
  });

  router.post('/', (req, res) => {
    try {
      let nuevoProd = req.body;
      Contenedor.save(nuevoProd).then(res.redirect('/api/productos/'));
    } catch (e) {
      res.json({ mensaje: 'no se pudo agregar el producto.', error: e });
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
  });
  server.on('error', (error) => console.log(`Error en el servidor: ${error}`));

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
}
test();
