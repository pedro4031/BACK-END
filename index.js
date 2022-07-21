const fs = require("fs");

class contenedor {
  constructor(nombre) {
    this.nombre = `./${nombre}.json`;
  }

  async getData() {
    try {
      return await fs.promises.readFile(this.nombre, "utf-8");
    } catch (e) {
      if (e.code == "ENOENT") {
        await fs.promises.writeFile(this.nombre, "[]");
        return await fs.promises.readFile(this.nombre, "utf-8");
      } else console.log("No se pudo crear el archivo.");
    }
  }

  async save(producto) {
    try {
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      const indice = arrayProductos.map((prod) => prod.id).sort();
      producto.id = indice[indice.length - 1] + 1 || 1;
      console.log(producto.id);
      arrayProductos.push(producto);
      await fs.promises.writeFile(this.nombre, JSON.stringify(arrayProductos));
    } catch (e) {
      console.log(`No se pudo guardar el objeto. Error:${e}`);
    }
  }

  async getById(ID) {
    try {
      let arrayProductosJSON = await this.getData();
      let arrayProductos = JSON.parse(arrayProductosJSON);
      let producto = arrayProductos.find((prod) => prod.id == ID);
      console.log(producto);
      if (producto != undefined) {
        console.log("El producto es:", producto);
      } else console.log(null);
    } catch (e) {
      console.log(`No se logró buscar el objeto. Error: ${e}`);
    }
  }
  async deleteById(ID) {
    let arrayProductosJSON = await this.getData();
    let arrayProductos = JSON.parse(arrayProductosJSON);
    let indice = arrayProductos.findIndex((prod) => prod.id == ID);
    arrayProductos.splice(indice, indice + 1);

    await fs.promises.writeFile(this.nombre, JSON.stringify(arrayProductos));
    console.log("Producto eliminado.");
    try {
    } catch (e) {
      console.log(`No se pudo eliminar el producto. Error: ${e}`);
    }
  }

  async getAll() {
    try {
      const arrayProductosJ = await this.getData();
      console.log(JSON.parse(arrayProductosJ));
      return JSON.parse(arrayProductosJ);
    } catch (e) {
      console.log(`No se pudieron traer los productos. Error: ${e}`);
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.nombre, "[]");
      console.log("Se vaciaron los productos.");
    } catch (e) {
      console.log(`No se pudo borrar el archivo. Error: ${e}`);
    }
  }
}

async function test() {
  let Contenedor = new contenedor("productos");

  Contenedor.getData();

  await Contenedor.save({
    title: "agua",
    price: 50,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3040339_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fagua-mineral-bonaqua-sin-gas-botella-x-1500-cc%2F_%2FA-3040339-3040339-s&tbnid=aoOcdHz_p8IsyM&vet=12ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ..i&docid=8Fz2ltgcFLvLbM&w=600&h=600&q=agua%20botella&ved=2ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ",
  });

  await Contenedor.save({
    title: "coca-cola",
    price: 70,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvalsegura.com%2Fwp-content%2Fuploads%2F2016%2F02%2Fcc-33cl.jpg&imgrefurl=https%3A%2F%2Fvalsegura.com%2Fcatalogo-interactivo%2Fcoca-cola-iberian-partners%2Frefrescos-y-energeticas-coca-cola-iberian-partners%2Fcoca-cola-35-cl-vidrio%2F&tbnid=GQzfgq4hCRpgtM&vet=12ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ..i&docid=cNBoORWaldaZpM&w=800&h=800&q=coca%20botella&ved=2ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ",
  });

  await Contenedor.getAll();
  await Contenedor.deleteAll();

  await Contenedor.save({
    title: "cerveza",
    price: 80,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3100424_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fcerveza-imperial-rubia-botella-retornable-x-1000-cc%2F_%2FA-3100424-3100424-s&tbnid=PYnqob0ku3jQdM&vet=12ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ..i&docid=Qy4owft0rZ08BM&w=600&h=600&q=cerveza%20botella&ved=2ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ",
  });

  await Contenedor.save({
    title: "chocolate",
    price: 15,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Fvector-gratis%2Fbarra-chocolate-paquete-blanco_1308-57644.jpg%3Fw%3D2000&imgrefurl=https%3A%2F%2Fwww.freepik.es%2Ffotos-vectores-gratis%2Fbarra-de-chocolate-dibujo&tbnid=GUbZsCfISDGuDM&vet=12ahUKEwjrkqHk5Ij5AhUcu5UCHQcgCXYQMyhDegUIARCMAQ..i&docid=TgP874NDq-2bQM&w=1993&h=2000&q=chocolate&ved=2ahUKEwjrkqHk5Ij5AhUcu5UCHQcgCXYQMyhDegUIARCMAQ",
  });

  await Contenedor.getById(1);

  await Contenedor.deleteById(1);

  await Contenedor.getAll();
}
test();
