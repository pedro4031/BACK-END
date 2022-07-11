class usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }

  getFullName() {
    console.log(`hola soy ${this.nombre} ${this.apellido}`);
  }
  addMascota(mascota) {
    this.mascotas.push(mascota);
  }

  countMascotas() {
    console.log(`El usuario tiene ${this.mascotas.length}`);
  }
  addBook(nombre, autor) {
    this.libros.push({ nombre, autor });
  }
  getBookNames() {
    this.libros.map((libro) => {
      console.log(libro.nombre);
    });
  }
}

const persona = new usuario(
  "pepe",
  "hernandez",
  [
    { nombre: "Alicia en el país de las maravillas", autor: "Lewis Carroll" },
    { nombre: "harry potter", autor: "JK Rowling" },
  ],
  ["gato", "perro", "perico"]
);

persona.getFullName();
persona.addMascota("iguana");
persona.countMascotas();
persona.addBook("El misterio de Salem's Lot", "Stephen King");
persona.getBookNames();
