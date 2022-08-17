const fs = require('fs');

class contenedor {
  constructor(nombre) {
    this.nombre = `./${nombre}.json`;
  }

  async getData() {
    try {
      return await fs.promises.readFile(this.nombre, 'utf-8');
    } catch (e) {
      if (e.code == 'ENOENT') {
        await fs.promises.writeFile(this.nombre, '[]');
        return await fs.promises.readFile(this.nombre, 'utf-8');
      } else console.log('No se pudo crear el archivo.');
    }
  }

  async save(producto) {
    try {
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      const indice = arrayProductos.map((prod) => prod.id).sort();
      producto.id = indice[indice.length - 1] + 1 || 1;

      arrayProductos.push(producto);
      await fs.promises.writeFile(this.nombre, JSON.stringify(arrayProductos));
      return producto;
    } catch (e) {
      console.log(`No se pudo guardar el objeto. Error:${e}`);
    }
  }

  async getById(ID) {
    try {
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      let producto = arrayProductos.find((prod) => prod.id == ID);

      if (producto != undefined) {
        return producto;
      } else return { error: 'producto no encontrado.' };
    } catch (e) {
      console.log(`No se logró buscar el objeto. Error: ${e}`);
    }
  }
  async deleteById(ID) {
    try {
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      let indice = arrayProductos.findIndex((prod) => prod.id == ID);
      if (indice != -1) {
        arrayProductos.splice(indice, 1);

        await fs.promises.writeFile(this.nombre, JSON.stringify(arrayProductos));
        return { mensaje: 'producto eliminado' };
      } else return { mensaje: 'ID incorrecta. producto no encontrado.' };
    } catch (e) {
      console.log(`No se pudo eliminar el producto. Error: ${e}`);
    }
  }

  async getAll() {
    try {
      const arrayProductosJ = await this.getData();

      return JSON.parse(arrayProductosJ);
    } catch (e) {
      console.log(`No se pudieron traer los productos. Error: ${e}`);
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.nombre, '[]');
    } catch (e) {
      console.log(`No se pudo borrar el archivo. Error: ${e}`);
    }
  }

  async actualizar(ID, cambio) {
    try {
      let prodOriginal = await this.getById(ID);
      let prodCambiado = { ...prodOriginal, ...cambio };
      await this.deleteById(ID);
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      arrayProductos.push(prodCambiado);
      await fs.promises.writeFile(this.nombre, JSON.stringify(arrayProductos));
      return prodCambiado;
    } catch (e) {
      return { error: 'no se pudo actualizar el producto...' };
    }
  }
}

module.exports = contenedor;
