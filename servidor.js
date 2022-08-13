const contenedor = require('./ClaseContenedor');
const express = require('express');
const { Router } = express;

const app = express();
const router = Router();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', router);
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

async function test() {
  let Contenedor = new contenedor('productos');
  await Contenedor.deleteAll();
  await Contenedor.getData();

  app.get('/', (req, res) => {
    res.render('pages/index');
  });

  router.get('/', (req, res) => {
    try {
      Contenedor.getAll().then((resp) => {
        let cond;
        resp.length > 0 ? (cond = true) : (cond = false);
        res.render('pages/tabla', { productos: resp, mostrar: cond });
      });
    } catch (e) {
      res.json({ mensaje: 'no se encontraron los productos', error: e });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      let ID = req.params.id;
      Contenedor.getById(ID).then((resp) => {
        res.json(resp);
      });
    } catch (e) {
      res.json({ mensaje: 'no se pudo buscar el producto.', error: e });
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

  router.put('/:id', async (req, res) => {
    try {
      let ID = req.params.id;
      let cambio = req.body;
      Contenedor.actualizar(ID, cambio).then((resp) => res.json(resp));
    } catch (e) {
      res.json({ mensaje: 'no se pudo actualizar el producto', error: e });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      let ID = req.params.id;
      await Contenedor.deleteById(ID).then((data) => res.json(data));
    } catch (e) {
      res.json({ error: e });
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
  });
  server.on('error', (error) => console.log(`Error en el servidor: ${error}`));
}
test();
