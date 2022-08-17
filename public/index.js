const socket = io();
socket.on("connect", () => {
	console.log("me conecte!");
});

socket.on("msg", (data) => {
	alert(data);
});

function enviar() {
	const nombre = document.querySelector("#nombre").value;
	const mensaje = document.querySelector("#mensaje").value;

	socket.emit("datos", nombre + ": " + mensaje);
}

socket.on("arr-chat", (data) => {
	const html = data.reduce((html, item) => `<div>${item}</div>` + html, "");
	document.querySelector("#div-chats").innerHTML = html;
});
