let PRODUCTOS = [];

function saveProd(e) {
	e.preventDefault();
	let categoria = e.target.categoria;
	let nombre = e.target.nombre;
	let descripcion = e.target.descripcion;
	let codigo = e.target.codigo;
	let foto = e.target.foto;
	let precio = e.target.precio;
	let stock = e.target.stock;
	if (precio < 0 || stock < 0) {
		Toastify({
			text: "Los valores numericos no pueden ser negativos",
			duration: 1000,
			gravity: "top",
			position: "center",
			stopOnFocus: true,
			style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
		}).showToast();
	} else {
		let creacion = new Date().toISOString();
		let nuevoProd = {
			timestamp: creacion,
			categoria: categoria.value,
			nombre: nombre.value,
			descripcion: descripcion.value,
			codigo: codigo.value,
			foto: foto.value,
			precio: precio.value,
			stock: stock.value,
		};
		try {
			fetch("/productos/", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(nuevoProd),
			})
				.then((data) => data.json())
				.then((resp) => {
					categoria.value = null;
					nombre.value = null;
					descripcion.value = null;
					codigo.value = null;
					foto.value = null;
					precio.value = null;
					stock.value = null;

					let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
					Toastify({
						text: respuesta,
						duration: 1000,
						gravity: "top",
						position: "center",
						stopOnFocus: true,
						style: { background: "linear-gradient(to right, #009FFD, #2A2A72)" },
					}).showToast();
				});
		} catch (error) {
			Toastify({
				text: "no se pudo guardar el producto intentelo de nuevo...",
				duration: 1000,
				gravity: "top",
				position: "center",
				stopOnFocus: true,
				style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
			}).showToast();
		}
	}

	return false;
}

function updateProd(e) {
	e.preventDefault();
	let idProd = e.target.idProd;
	let categoria = e.target["N-categoria"];
	let nombre = e.target["N-nombre"];
	let descripcion = e.target["N-descripcion"];
	let codigo = e.target["N-codigo"];
	let foto = e.target["N-foto"];
	let precio = e.target["N-precio"];
	let stock = e.target["N-stock"];
	if (precio.value < 0 || stock.value < 0) {
		Toastify({
			text: "Los valores numericos no pueden ser negativos.",
			duration: 1000,
			gravity: "top",
			position: "center",
			stopOnFocus: true,
			style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
		}).showToast();
	} else {
		let actualizacion = new Date().toISOString();
		let updatedProd = {};

		updatedProd.timestamp = actualizacion;

		idProd.value != undefined && idProd.value != "" && (updatedProd.idProd = idProd.value);

		categoria.value != undefined &&
			categoria.value != "" &&
			(updatedProd.categoria = categoria.value);

		nombre.value != undefined && nombre.value != "" && (updatedProd.nombre = nombre.value);

		descripcion.value != undefined &&
			descripcion.value != "" &&
			(updatedProd.descripcion = descripcion.value);

		codigo.value != undefined && codigo.value != "" && (updatedProd.codigo = codigo.value);

		foto.value != undefined && foto.value != "" && (updatedProd.foto = foto.value);

		precio.value != undefined && precio.value != "" && (updatedProd.precio = precio.value);

		stock.value != undefined && stock.value != "" && (updatedProd = stock.value);

		try {
			fetch(`/productos/${idProd.value}`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(updatedProd),
			})
				.then((data) => data.json())
				.then((resp) => {
					idProd.value = null;
					categoria.value = null;
					nombre.value = null;
					descripcion.value = null;
					codigo.value = null;
					foto.value = null;
					precio.value = null;
					stock.value = null;
					let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
					Toastify({
						text: respuesta,
						duration: 1000,
						gravity: "top",
						position: "center",
						stopOnFocus: true,
						style: { background: "linear-gradient(to right, #009FFD, #2A2A72)" },
					}).showToast();
				});
		} catch (error) {
			Toastify({
				text: "no se pudo actualizar el producto intentelo de nuevo...",
				duration: 1000,
				gravity: "top",
				position: "center",
				stopOnFocus: true,
				style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
			}).showToast();
		}
	}

	return false;
}

function deleteProd(e) {
	e.preventDefault();
	let idProd = e.target["D-idProd"];
	try {
		fetch(`/productos/${idProd.value}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((data) => data.json())
			.then((resp) => {
				idProd.value = null;
				let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
				Toastify({
					text: respuesta,
					duration: 1000,
					gravity: "top",
					position: "center",
					stopOnFocus: true,
					style: { background: "linear-gradient(to right, #009FFD, #2A2A72)" },
				}).showToast();
			});
	} catch (e) {
		Toastify({
			text: "no se pudo borrar el producto intentelo de nuevo...",
			duration: 1000,
			gravity: "top",
			position: "center",
			stopOnFocus: true,
			style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
		}).showToast();
	}
}

async function cargarProds(listaProds, cartProds) {
	let IDs = [];
	if (Array.isArray(cartProds)) {
		IDs = cartProds.map((prod) => prod._id);
	}

	let divP = document.getElementById("productos");
	divP.innerHTML = "";
	listaProds.forEach((prod) => {
		let publicacion = `<div class="col-3 gy-4"><div class="card " style="width: 18rem;">
			<div class="card-header">
				${prod.categoria}
			</div>
			<img src=${prod.foto} class="mx-auto img-fluid" alt="foto de producto" style="height: 12rem">
			<div class="card-body text-start "style="height: 10rem;">
				<h5 class="card-title">${prod.nombre}</h5>
				<h6 class="card-subtitle mb-2 text-muted overflow-auto w-auto h-75">Descripción: ${
					prod.descripcion
				}</h6>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"><span>$</span><span>${prod.precio}</span></li>
				<li class="list-group-item"><span>stock:</span> <span>${prod.stock}</span></li>
				<li class="list-group-item">
				${
					IDs.includes(prod._id)
						? "producto en carrito"
						: `<i id="restar" class="fa-solid fa-circle-minus text-primary user-select-none" type="button" onclick="restar(event)"></i>
					<span class="">0</span>
					<i id="sumar" class="fa-solid fa-circle-plus text-primary user-select-none" type="button" onclick="sumar(event)"></i>
					<i id=${prod._id} class="fa-solid fa-cart-arrow-down ms-3 user-select-none" style="color:#e95701" type="button" onclick="agregarCart(event)"></i>`
				}
					
				</li>
				<li class="list-group-item">
					${prod._id}
				</li>
			</ul>
			</div></div>`;

		divP.innerHTML += publicacion;
	});
}

function cargarCategorias(listaProds) {
	let categorias = document.getElementById("categorias");

	categorias.innerHTML = "<option value='todo'>Todos</option>";

	let opcionesFiltro = listaProds.map((prod) => prod.categoria);

	opcionesCat = [...new Set(opcionesFiltro)];

	opcionesCat.forEach((op) => {
		categorias.innerHTML += `<option value=${op.replace(/\s/g, "_")}>${op}</option>`;
	});
}

function filtros(e) {
	if (e) e.preventDefault();

	let categoria = document.getElementById("categorias").value.replace(/_/g, " ");
	let precioMin = document.getElementById("precioMin").value;
	let precioMax = document.getElementById("precioMax").value;
	let valorMin = document.getElementById("valorMin");
	let valorMax = document.getElementById("valorMax");
	let busqueda = document.getElementById("buscador").value;

	valorMin.innerHTML = precioMin;
	valorMax.innerHTML = precioMax;

	let prodsFiltrados = PRODUCTOS.filter((prod) => {
		return (
			(prod.categoria == categoria || categoria == "todo") &&
			prod.precio >= precioMin &&
			prod.precio <= precioMax &&
			(prod.nombre.includes(busqueda) || busqueda == undefined || busqueda == "")
		);
	});

	cargarProds(prodsFiltrados);

	return false;
}

window.onload = () => {
	if (!document.getElementById("inicio")) {
		fetch("/carritos/productos")
			.then((data) => data.json())
			.then((prodsCart) => {
				PRODUCTOSCART = prodsCart;
				if (document.getElementById("productos")) {
					fetch("/productos/")
						.then((data) => data.json())
						.then((resp) => {
							PRODUCTOS = resp;
							cargarProds(resp, prodsCart);
							cargarCategorias(resp);

							let precioMaximo = PRODUCTOS.sort((min, max) => min.precio - max.precio)[
								PRODUCTOS.length - 1
							].precio;
							document.getElementById("precioMax").max = precioMaximo;
							document.getElementById("precioMax").value = precioMaximo;
							document.getElementById("valorMax").innerHTML = precioMaximo;
						});
				}
			});

		if (document.getElementById("precioFinal")) calcularTotal();
		cartStock();
	}
};
