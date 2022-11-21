let PRODUCTOS = [];

function saveProd(e) {
	e.preventDefault();
	let categoria = e.target.categoria.value;
	let nombre = e.target.nombre.value;
	let descripcion = e.target.descripcion.value;
	let codigo = e.target.codigo.value;
	let foto = e.target.foto.value;
	let precio = e.target.precio.value;
	let stock = e.target.stock.value;
	if (precio < 0 || stock < 0) {
		alert("Los valores numericos no pueden ser negativos.");
	} else {
		let creacion = new Date().toISOString();
		let nuevoProd = {
			timestamp: creacion,
			categoria: categoria,
			nombre: nombre,
			descripcion: descripcion,
			codigo: codigo,
			foto: foto,
			precio: precio,
			stock: stock,
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
					categoria = null;
					nombre = null;
					descripcion = null;
					codigo = null;
					foto = null;
					precio = null;
					stock = null;

					let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
					alert(respuesta);
				});
		} catch (error) {
			alert("no se pudo guardar el producto intentelo de nuevo...");
		}
	}

	return false;
}

function updateProd(e) {
	e.preventDefault();
	let idProd = e.target.idProd.value;
	let categoria = e.target["N-categoria"].value;
	let nombre = e.target["N-nombre"].value;
	let descripcion = e.target["N-descripcion"].value;
	let codigo = e.target["N-codigo"].value;
	let foto = e.target["N-foto"].value;
	let precio = e.target["N-precio"].value;
	let stock = e.target["N-stock"].value;
	if (precio.value < 0 || stock.value < 0) {
		alert("Los valores numericos no pueden ser negativos.");
	} else {
		let actualizacion = new Date().toISOString();
		let updatedProd = {};

		updatedProd.timestamp = actualizacion;

		idProd != undefined && idProd != "" && (updatedProd.idProd = idProd);

		categoria != undefined && categoria != "" && (updatedProd.categoria = categoria);

		nombre != undefined && nombre != "" && (updatedProd.nombre = nombre);

		descripcion != undefined && descripcion != "" && (updatedProd.descripcion = descripcion);

		codigo != undefined && codigo != "" && (updatedProd.codigo = codigo);

		foto != undefined && foto.value != "" && (updatedProd.foto = foto.value);

		precio != undefined && precio != "" && (updatedProd.precio = precio);

		stock != undefined && stock != "" && (updatedProd = stock);

		try {
			fetch(`/productos/${idProd}`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(updatedProd),
			})
				.then((data) => data.json())
				.then((resp) => {
					idProd = null;
					categoria = null;
					nombre = null;
					descripcion = null;
					codigo = null;
					foto = null;
					precio = null;
					stock = null;
					let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
					alert(respuesta);
				});
		} catch (error) {
			alert("no se pudo actualizar el producto intentelo de nuevo...");
		}
	}

	return false;
}

function deleteProd(e) {
	e.preventDefault();
	let idProd = e.target["D-idProd"].value;
	try {
		fetch(`/productos/${idProd}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((data) => data.json())
			.then((resp) => {
				idProd = null;
				let respuesta = `${resp.error ? `error: ${resp.error}.` : ""} ${resp.mensaje}`;
				alert(respuesta);
			});
	} catch (e) {
		alert("no se pudo borrar el producto intentelo de nuevo...");
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
