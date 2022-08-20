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

  if (mensaje.value !== '') {
    const mail = document.querySelector('#mail');
    const date = new Date();
    const FyH = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    socket.emit('nuevoMsg', { title: mail.value, price: FyH, thumbnail: mensaje.value });
    mensaje.value = '';
  } else {
    alert('Mensaje vacío.');
  }
  return false;
}

socket.on('chat', (data) => {
  let mensajes = data.reduce(
    (html, msg) => html + `<div><p><strong class="text-primary">${msg.title}</strong> <span class="texto-marron"> [${msg.price}]</span> <em class="text-success">: ${msg.thumbnail}</em> </p></div>`,
    ''
  );
  const chatBox = document.querySelector('#chat-box');
  chatBox.innerHTML = mensajes;
  chatBox.scrollTop = chatBox.scrollHeight;
});

//Chat de mensajes fin
