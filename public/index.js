//Esquemas para desnormalizar

const schema = normalizr.schema;
const authorSchema = new schema.Entity('Author');
const textSchema = new schema.Entity('post');
const chat = new schema.Entity('posts', {
  mensajes: [
    {
      author: authorSchema,
      text: textSchema,
    },
  ],
});

//Conexiones socket
const socket = io();
socket.on('connect', () => {
  console.log('conectado con servidor');
});

//Tabla de productos inicio

function agregarP() {
  const title = document.querySelector('#title');
  const price = document.querySelector('#price');
  const thumbnail = document.querySelector('#thumbnail');
  if (title.value === '' || price.value === '' || thumbnail.value === '') {
    alert('Faltan completar datos');
  } else {
    socket.emit('nuevoProd', { title: title.value, price: price.value, thumbnail: thumbnail.value });
    title.value = '';
    price.value = '';
    thumbnail.value = '';
  }
}

function agregarRandom() {
  fetch('/api/productos-test')
    .then((data) => data.json())
    .then((resp) => {
      for (let i = 0; i < 5; i++) {
        socket.emit('nuevoProd', { title: resp[i].name, price: resp[i].price, thumbnail: resp[i].foto });
      }
    });
}

socket.on('listaProds', (data) => {
  if (data.length > 0) {
    let html = data.reduce(
      (html, item) =>
        html +
        `<tr>
        <td><h3>${item.title}</h3></td> 
        <td><h3>${item.price}</h3></td>  
        <td><img src="${item.thumbnail}" class="product-img"/></td> 
       </tr>`,
      `<table class="table table-bordered table-striped table-secondary text-center align-middle">
      <thead class="letra-k">
          <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Precio</th>
          <th scope="col">Foto</th>
          </tr>
      </thead>
      <tbody class="letra-k-l" id="listaProds">`
    );
    html = html + `</tbody></table>`;
    document.querySelector('#tablaProds').innerHTML = html;
  } else {
    const html = `
    <div class="text-center letra-k-l">
        <h2>Sin productos guardados</h2>
        <h3>Ingrese productos en el formulario</h3>
    </div>`;
    document.querySelector('#tablaProds').innerHTML = html;
  }
});

//Tabla de productos fin

//Chat de mensajes inicio

function enviarMsg(e) {
  const mensaje = document.querySelector('#mensaje');
  const nombre = document.querySelector('#nombre').value;
  const apellido = document.querySelector('#apellido').value;
  const edad = document.querySelector('#edad').value;
  const alias = document.querySelector('#alias').value;
  const avatar = document.querySelector('#avatar').value;

  if (nombre == '' || apellido == '' || edad == '' || alias == '' || avatar == '') {
    alert('Falta completar información');
    return false;
  }
  if (edad <= 0) {
    alert('Edad incorrecta');
    return false;
  }

  if (mensaje.value !== '') {
    const mail = document.querySelector('#mail');
    const date = new Date();
    const FyH = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    socket.emit('nuevoMsg', { mail: mail.value, FyH: FyH, mensaje: mensaje.value, nombre, apellido, edad, alias, avatar });
    mensaje.value = '';
  } else {
    alert('Mensaje vacío.');
  }
  return false;
}

socket.on('chat', (data) => {
  console.log(data);
  console.log(JSON.stringify(data).length);
  const dataOriginal = normalizr.denormalize(data.result, chat, data.entities);
  console.log(JSON.stringify(dataOriginal).length);
  console.log(dataOriginal);
  let compresion = (JSON.stringify(dataOriginal).length / JSON.stringify(data).length) * 100 - 100;

  let mensajes = dataOriginal.mensajes.reduce(
    (html, msg) =>
      html +
      `<div><p><img src="${msg.author.avatar}" class="avatar-img rounded-circle pe-1"/><strong class="text-primary">${msg.author.id}</strong> <span class="texto-marron"> [${msg.text.id}]</span> <em class="text-success">: ${msg.text.mensaje}</em> </p></div>`,
    ''
  );
  const chatBox = document.querySelector('#chat-box');
  const compression = document.querySelector('#compression');
  chatBox.innerHTML = mensajes;
  chatBox.scrollTop = chatBox.scrollHeight;
  compression.innerHTML = compresion.toString().slice(0, 5);
});

//Chat de mensajes fin
