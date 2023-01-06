const socket = io();

let receiver = "";
let sender = infoCliente.usuario;
let usuarios = [];

window.onload = () => {
	if (sender != "administrador1") {
		receiver = "administrador1";
		getMsgs();
	} else {
		fetch("/getusuarios")
			.then((data) => data.json())
			.then((resp) => {
				usuarios = resp;
				usuarios.forEach((user) => {
					document.getElementById(
						"users"
					).innerHTML += `<button id=${user.usuario} class="list-group-item list-group-item-action" onclick="userSelected(this.innerHTML)" data-bs-dismiss="offcanvas" aria-label="Close">${user.usuario}</button>`;
				});
			})
			.catch((e) => console.log(e));
	}
};

socket.emit("user_connected", infoCliente.usuario);

socket.on("user_connected", function (username) {
	if (username != "administrador1" && sender == "administrador1") {
		let agregado = usuarios.some((user) => user.usuario == username);
		if (!agregado) {
			let html = "";
			html += `<button id=${username} class="list-group-item list-group-item-action" onclick="userSelected(this.innerHTML)" data-bs-dismiss="offcanvas" aria-label="Close">${username} </button>`;
			document.getElementById("users").innerHTML += html;
		}
	}
});

socket.on("new_message", function (data) {
	if (data.sender == receiver) {
		let chatBox = document.getElementById("chat-box");

		chatBox.innerHTML += `<div><p><strong class="text-primary">${data.sender}:</strong><span class="text-light">${data.mensaje}</span></p></div>`;
		chatBox.scrollTop = chatBox.scrollHeight;
	}
});

function userSelected(username) {
	receiver = username;
	let buttonDisabled = document.getElementsByClassName("disabled-b");
	console.log(buttonDisabled);
	if (buttonDisabled.length == 1) {
		document.getElementsByClassName("disabled-b")[0].disabled = false;
		buttonDisabled[0].classList.remove("disabled-b");
	}
	let button = document.getElementById(username);
	button.classList.add("disabled-b");
	button.disabled = true;

	getMsgs();
}

function getMsgs() {
	fetch("/getmessages", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ sender, receiver }),
	})
		.then((data) => data.json())
		.then((resp) => {
			let html = "";
			for (let a = 0; a < resp.length; a++) {
				let horario = new Date(resp[a].timestamp);
				let tiempo = `
				${horario.getDate()}/${horario.getMonth() + 1}-
				${horario.getHours()}:${horario.getMinutes()}:${horario.getSeconds()}
				`;
				html += `<div><p><strong class="text-primary">${tiempo} 
				${resp[a].sender == sender ? "yo" : resp[a].sender}
				:</strong><span class="text-light"> ${resp[a].mensaje}</span></p></div>`;
			}

			document.getElementById("chat-box").innerHTML = "";
			document.getElementById("chat-box").innerHTML = html;
		});
}

function msgg(e) {
	e.preventDefault();
	let mensaje = e.target.mensaje;

	if (mensaje.value != undefined && mensaje.value != "" && receiver != "") {
		let timestamp = new Date();

		socket.emit("user_message", { sender, receiver, mensaje: mensaje.value, timestamp });

		let chatBox = document.getElementById("chat-box");

		chatBox.innerHTML += `<div><p><strong class="text-primary">yo:</strong><span class="text-light">${mensaje.value}</span></p></div>`;
		mensaje.value = "";
		chatBox.scrollTop = chatBox.scrollHeight;
	} else {
		return false;
	}
}
