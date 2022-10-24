const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const { chat } = require('./schemas');

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
                    c.string('nombre');
                    c.string('apellido');
                    c.integer('edad');
                    c.string('alias');
                    c.string('avatar');
                  })
                  .then((resp) => console.log('tabla chats:', resp));
              }
            })
            .catch((e) => {
              throw new Error(`No se pudo crear la tabla, error: ${e}`);
            });
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
            .catch((e) => {
              throw new Error(`No se pudo crear la tabla, error: ${e}`);
            });
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
        .then((resp) => console.log('producto/mensaje nuevo:', resp));
    } catch (e) {
      throw new Error(`No se pudo guardar el objeto. Error:${e}`);
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
              return arrayProds;
              break;

            case 'c':
              const chatOriginal = { id: 'Mensajes', mensajes: [] };
              let num = 0;
              arrayProds.forEach((msg) => {
                let autor = { author: {}, text: {} };

                autor.author.mail = msg.mail;
                autor.author.nombre = msg.nombre;
                autor.author.apellido = msg.apellido;
                autor.author.edad = msg.edad;
                autor.author.alias = msg.alias;
                autor.author.avatar = msg.avatar;
                autor.text.mensaje = msg.mensaje;
                autor.text.id = msg.FyH;
                chatOriginal.mensajes.push(autor);
                num++;
              });
              const chatNormalizado = normalize(chatOriginal, chat);

              return chatNormalizado;
              break;
          }
        });
    } catch (e) {
      throw new Error(`No se pudieron traer los productos. Error: ${e}`);
    }
  }
}

module.exports = contenedor;
