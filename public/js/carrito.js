let PRODUCTOSCART = [];

function restar(e) {
	let cant = parseInt(e.target.nextElementSibling.innerHTML);
	if (cant - 1 >= 0) {
		cant--;
		e.target.nextElementSibling.innerHTML = cant;
	}
}
function sumar(e) {
	let cant = parseInt(e.target.previousElementSibling.innerHTML);
	let stock = parseInt(e.target.parentElement.previousElementSibling.lastElementChild.innerHTML);
	if (cant + 1 <= stock) {
		cant++;
		e.target.previousElementSibling.innerHTML = cant;
	}
}

function agregarCart(e) {
	let idProd = e.target.id;
	let cantProd = parseInt(e.target.previousElementSibling.previousElementSibling.innerHTML);
	if (cantProd == 0) {
		alert("cantidad inválida");
	} else {
		let cartProd = { idProd, cantProd };
		fetch("/carritos/productos", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(cartProd),
		})
			.then((data) => data.json())
			.then((resp) => {
				if (resp.mensaje != "producto guardado") {
					alert("no se pudo guardar el producto en el carrito.");
				} else {
					alert(" producto guardado en el carrito.");
					e.target.parentElement.innerHTML = "producto en carrito";
					cartStock();
				}
			});
	}
}

function calcularTotal() {
	let precios = Array.from(document.getElementsByClassName("precioCant"));
	precios = precios.map((precio) => parseFloat(precio.innerHTML));
	precioFinal = precios.reduce((total, precio) => total + precio, 0);
	document.getElementById("precioFinal").innerHTML = precioFinal;
}

function cartStock() {
	fetch("/carritos/productos")
		.then((data) => data.json())
		.then((cartProds) => {
			PRODUCTOSCART = cartProds;
			let comprar = document.getElementById("comprar") || {};
			if (cartProds.length > 0) {
				document.getElementById("iconoCart").innerHTML =
					"<span class='position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1'><span class='visually-hidden'>unread messages</span></span>";
				comprar.disabled = false;
			} else {
				document.getElementById("iconoCart").innerHTML = "";
				comprar.disabled = true;
			}
		});
}

function eliminarCart(ID) {
	fetch(`/carritos/productos/${ID}`, {
		method: "DELETE",
	})
		.then((data) => data.json())
		.then((resp) => {
			if (resp.mensaje != "producto borrado") {
				alert("no se pudo borrar el producto del carrito.");
			} else {
				alert(" producto borrado del carrito.");
				document.getElementById(ID).innerHTML = "";
				calcularTotal();
				cartStock();
			}
		});
}

function comprar() {
	fetch("/carritos/comprar", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(PRODUCTOSCART),
	})
		.then((data) => data.json())
		.then((resp) => {
			if (resp.mensaje == "compra realizada") {
				alert("gracias por su compra...");
				window.location.href = "/";
			} else {
				alert(`${resp.mensaje}.Compra cancelada.`);
			}
		});
}
