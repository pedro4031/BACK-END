const fs = require("fs");

async function crearArchivo(nombre) {
  try {
    await fs.promises.writeFile(`./${nombre}`, JSON.stringify([]));
  } catch (e) {
    console.log(e);
  }
}

class contenedor {
  constructor(nombre) {
    crearArchivo(nombre);
  }

  save(producto) {
    async function guardarProducto() {
      try {
        let data = await fs.promises.readFile("./productos.txt", "utf-8");
        let arrayProductos = JSON.parse(data);
        let ID = 0;
        arrayProductos.forEach((prod) => {
          prod.id > ID && (ID = prod.id);
        });
        producto.id = ID + 1;
        arrayProductos.push(producto);
        fs.promises.writeFile(
          "./productos.txt",
          JSON.stringify(arrayProductos)
        );
        console.log(`id del producto ingresado:${producto.id} `);
      } catch (e) {
        console.log(e);
      }
    }
    guardarProducto();
  }
  getById(id) {
    async function encontrarProducto() {
      try {
        let data = await fs.promises.readFile("./productos.txt", "utf-8");
        let arrayProductos = JSON.parse(data);
        let producto = arrayProductos.filter((prod) => prod.id == id);
        producto.length == 0 ? console.log(null) : console.log(...producto);
      } catch (e) {
        console.log(e);
      }
    }

    encontrarProducto();
  }
  getAll() {
    async function mostrarProductos() {
      try {
        let data = await fs.promises.readFile("./productos.txt", "utf-8");
        let arrayProductos = JSON.parse(data);
        console.log(arrayProductos);
      } catch (e) {
        console.log(e);
      }
    }
    mostrarProductos();
  }
  deleteById(id) {
    async function eliminarProducto() {
      try {
        let data = await fs.promises.readFile("./productos.txt", "utf-8");
        let arrayProductos = JSON.parse(data);
        let indice = arrayProductos.findIndex((prod) => prod.id == id);
        console.log(indice);
        arrayProductos.splice(indice, indice + 1);
        console.log(arrayProductos);
        fs.promises.writeFile(
          "./productos.txt",
          JSON.stringify(arrayProductos)
        );
      } catch (e) {
        console.log(e);
      }
    }
    eliminarProducto();
  }
  deleteAll() {
    async function borrarProductos() {
      try {
        fs.promises.writeFile("./productos.txt", JSON.stringify([]));
      } catch (e) {
        console.log(e);
      }
    }
    borrarProductos();
  }
}

let Contenedor = new contenedor("productos.txt");
setTimeout(() => {
  Contenedor.save({
    title: "agua",
    price: 50,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3040339_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fagua-mineral-bonaqua-sin-gas-botella-x-1500-cc%2F_%2FA-3040339-3040339-s&tbnid=aoOcdHz_p8IsyM&vet=12ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ..i&docid=8Fz2ltgcFLvLbM&w=600&h=600&q=agua%20botella&ved=2ahUKEwj8vLq6-oD5AhVrqJUCHXkzDTsQMygDegUIARDtAQ",
  });
}, 400);

setTimeout(() => {
  Contenedor.save({
    title: "coca-cola",
    price: 70,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvalsegura.com%2Fwp-content%2Fuploads%2F2016%2F02%2Fcc-33cl.jpg&imgrefurl=https%3A%2F%2Fvalsegura.com%2Fcatalogo-interactivo%2Fcoca-cola-iberian-partners%2Frefrescos-y-energeticas-coca-cola-iberian-partners%2Fcoca-cola-35-cl-vidrio%2F&tbnid=GQzfgq4hCRpgtM&vet=12ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ..i&docid=cNBoORWaldaZpM&w=800&h=800&q=coca%20botella&ved=2ahUKEwiplurY-oD5AhXgrZUCHQ4XDDAQMygIegUIARDzAQ",
  });
}, 500);
setTimeout(() => {
  Contenedor.save({
    title: "cerveza",
    price: 80,
    img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatics.dinoonline.com.ar%2Fimagenes%2Ffull_600x600_ma%2F3100424_f.jpg&imgrefurl=https%3A%2F%2Fwww.dinoonline.com.ar%2Fsuper%2Fproducto%2Fcerveza-imperial-rubia-botella-retornable-x-1000-cc%2F_%2FA-3100424-3100424-s&tbnid=PYnqob0ku3jQdM&vet=12ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ..i&docid=Qy4owft0rZ08BM&w=600&h=600&q=cerveza%20botella&ved=2ahUKEwiU5JLh-oD5AhVkqZUCHWnLBhEQMygDegUIARDtAQ",
  });
}, 600);

setTimeout(() => {
  Contenedor.getById(2);
}, 700);

setTimeout(() => {
  Contenedor.getAll();
}, 800);

setTimeout(() => {
  Contenedor.deleteById(2);
}, 900);

setTimeout(() => {
  Contenedor.deleteAll();
}, 1000);
