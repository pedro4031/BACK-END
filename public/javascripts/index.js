window.onload = () => {
	let tabla = document.getElementById("productos-tabla");
	if (tabla) {
		fetch("/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query: `query{getProductos{_id nombre precio stock foto}}` }),
		})
			.then((data) => data.json())
			.then((prods) => {
				prods = prods.data.getProductos;

				prods.forEach((prod) => {
					tabla.innerHTML += `
            <div class="card mb-3" style="width: 18rem;">
				<img
					src=${prod.foto}
					class="mx-auto img-fluid card-img-top"
					alt="foto de producto"
					style="height: 12rem"
				/>
				<div class="card-body">
					<h5 class="card-title">${prod.nombre}</h5>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">Stock: ${prod.stock}</li>
					<li class="list-group-item">Precio $${prod.precio}</li>
					<li class="list-group-item">ID: ${prod._id}</li>
				</ul>
			</div>`;
				});
			});
	}
};

function saveProd(e) {
	e.preventDefault();

	let nombre = e.target.nombre.value;
	let precio = e.target.precio.value;
	let foto = e.target.foto.value;
	let stock = e.target.stock.value;

	if (precio < 0 || stock < 0) {
		alert("Los valores numericos no pueden ser negativos.");
	} else {
		try {
			fetch("/graphql", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					query: `mutation{
					createProducto(datos:{nombre:"${nombre}" precio:${precio} foto:"${foto}" stock:${stock}}){_id}
				}`,
				}),
			})
				.then((data) => data.json())
				.then((resp) => {
					resp = resp.data.createProducto;
					if (typeof resp == "object" && resp._id) {
						alert("Producto guardado");
						location.reload();
					} else {
						alert("error al guardar el producto");
						console.log(resp);
						return false;
					}
				});
		} catch (error) {
			alert("no se pudo guardar el producto intentelo de nuevo...");
			console.log(error);
			return false;
		}
	}
	return false;
}

function updateProd(e) {
	e.preventDefault();
	let idProd = e.target.idprod.value;
	let nombre = e.target["nombre-u"].value;
	let precio = e.target["precio-u"].value;
	let foto = e.target["foto-u"].value;
	let stock = e.target["stock-u"].value;

	if (precio.value < 0 || stock.value < 0) {
		alert("Los valores numericos no pueden ser negativos.");
	} else {
		try {
			fetch(`/graphql`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					query: `mutation{
					updateProducto(_id:"${idProd}",datos:{nombre:"${nombre || null}",precio:${precio || null},foto:"${
						foto || null
					}",stock:${stock || null}}){_id}
				}`,
				}),
			})
				.then((data) => data.json())
				.then((resp) => {
					resp = resp.data;

					if (resp.updateProducto == null) {
						alert("producto no encontrado");
						return false;
					} else if (resp.updateProducto._id) {
						alert("Producto actualizado");
						location.reload();
					} else {
						alert("Error al actualizar producto");
						return false;
					}
				});
		} catch (error) {
			alert("no se pudo actualizar el producto intentelo de nuevo...");
			console.log(error);
			return false;
		}
	}

	return false;
}

function deleteProd(e) {
	e.preventDefault();
	let idProd = e.target["idprod-B"].value;
	try {
		fetch(`/graphql`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				query: `mutation{
				deleteProducto(_id:"${idProd}"){_id}
			}`,
			}),
		})
			.then((data) => data.json())
			.then((resp) => {
				resp = resp.data.deleteProducto;
				if (resp == null) {
					alert("error al borrar el producto");
					console.log(resp);
					return false;
				} else if (typeof resp == "object" && resp._id) {
					alert("Producto borrado");
					location.reload();
				} else {
					alert("error al borrar el producto");
					console.log(resp);
					return false;
				}
			});
	} catch (error) {
		alert("no se pudo borrar el producto intentelo de nuevo...");
		console.log(error);
		return false;
	}
}
