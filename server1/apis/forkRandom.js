process.on('message', (msg) => {
  let arrayNumeros = { cantidadDeNumeros: msg, numeros: [] };

  for (let i = 0; i < msg; i++) {
    let num = Math.floor(Math.random() * 1000 + 1);
    arrayNumeros.numeros.push(num);
  }
  process.send(arrayNumeros);
  process.exit();
});
