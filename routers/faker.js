const express = require('express');
const { Router } = express;
const { faker } = require('@faker-js/faker');

const routerFaker = express.Router();

routerFaker.get('/api/productos-test', (req, res) => {
  let productosRandom = [];

  for (let i = 0; i < 5; i++) {
    let prod = {};
    const randomName = faker.commerce.product();
    const randomPrice = faker.commerce.price(50, 10000);
    const randomFoto = faker.image.food(150, 100, true);
    prod.name = randomName;
    prod.price = randomPrice;
    prod.foto = randomFoto;
    productosRandom.push(prod);
  }
  res.json(productosRandom);
});

module.exports = routerFaker;
