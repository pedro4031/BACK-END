class contenedor {
  constructor(nombreTabla, config) {
    this.tabla = nombreTabla;
    this.config = config;
  }

  async createTabla(tipo) {
    const serverDB = this.config;
    try {
      switch (tipo) {
        case 'c':
          await serverDB.schema
            .hasTable(`${this.tabla}`)
            .then(async (exists) => {
              if (!exists) {
                return await serverDB.schema
                  .createTable(`${this.tabla}`, (c) => {
                    c.increments('id');
                    c.string('mail');
                    c.string('FyH');
                    c.text('mensaje');
                  })
                  .then((resp) => console.log('tabla chats:', resp));
              }
            })
            .catch((e) => console.log(e));
          break;

        case 'p':
          await serverDB.schema
            .hasTable(`${this.tabla}`)
            .then(async (exists) => {
              if (!exists) {
                return await serverDB.schema
                  .createTable(`${this.tabla}`, (c) => {
                    c.increments('id');
                    c.string('title');
                    c.integer('price');
                    c.string('thumbnail');
                  })
                  .then((resp) => console.log('tabla productos:', resp));
              }
            })
            .catch((e) => console.log(e));
          break;
        default:
          res.json({ mensaje: 'tipo de tabla no valido.' });
          break;
      }
    } catch (e) {
      res.json({ mensaje: 'ocurrió un error para crear la tabla.', error: e });
    }
  }

  async save(producto) {
    const serverDB = this.config;
    try {
      await serverDB(`${this.tabla}`)
        .insert(producto)
        .then((resp) => console.log('producto nuevo:', resp));
    } catch (e) {
      console.log(`No se pudo guardar el objeto. Error:${e}`);
    }
  }

  async getAll(tipo) {
    const serverDB = this.config;

    try {
      return await serverDB(`${this.tabla}`)
        .select('*')
        .then((arrayProds) => {
          switch (tipo) {
            case 'p':
              arrayProds = arrayProds.map((prod) => ({ title: prod.title, price: prod.price, thumbnail: prod.thumbnail }));
              break;

            case 'c':
              arrayProds = arrayProds.map((prod) => ({ mail: prod.mail, FyH: prod.FyH, mensaje: prod.mensaje }));
              break;
          }

          return arrayProds;
        });
    } catch (e) {
      console.log(`No se pudieron traer los productos. Error: ${e}`);
    }
  }
}

module.exports = contenedor;
