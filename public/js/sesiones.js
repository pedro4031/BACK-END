function login(e) {
	e.preventDefault();

	fetch("/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
	})
		.then((msg) => msg.json())
		.then((data) => {
			if (data.success) {
				window.location.href = "/";
			} else {
				Toastify({
					text: data.info,
					duration: 1500,
					gravity: "top",
					position: "center",
					stopOnFocus: true,
					style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
				}).showToast();
			}
		});
	return false;
}

function signup(e) {
	e.preventDefault();

	fetch("/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: e.target.username.value,
			password: e.target.password.value,
			password2: e.target.password2.value,
			usuario: e.target.usuario.value,
			edad: e.target.edad.value,
			direccion: e.target.direccion.value,
			prefijo: e.target.prefijo.value,
			telefono: e.target.telefono.value,
			avatar: e.target.avatar.value,
		}),
	})
		.then((msg) => msg.json())
		.then((data) => {
			if (data.success) {
				window.location.href = "/";
			} else {
				Toastify({
					text: data.info,
					duration: 1500,
					gravity: "top",
					position: "center",
					stopOnFocus: true,
					style: { background: "linear-gradient(to right, #FE5F75, #FC9842)" },
				}).showToast();
			}
		});
	return false;
}
