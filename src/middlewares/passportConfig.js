const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");
const esquemaUsuarios = require("../database/models/usuario");
const { carritoMongo } = require("../database/imports");
const { sendMail } = require("../utils/nodemailerConfig");
const { logger } = require("../utils/loger");

//fUNCIONES DE PASSPORT
function isValidPassword(user, password) {
	return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

//PASSPORT LOGIN STRATEGY

passport.use(
	"login",
	new LocalStrategy((username, password, done) => {
		esquemaUsuarios.findOne({ username }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				return done(null, false, { message: `Usuario ${username} no encontrado` });
			}

			if (!isValidPassword(user, password)) {
				return done(null, false, { message: "Contraseña inválida" });
			}

			return done(null, user);
		});
	})
);

//PASSPORT SIGN UP STRATEGY

passport.use(
	"signup",
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		(req, username, password, done) => {
			esquemaUsuarios.findOne({ username: username }, function (err, user) {
				if (err) {
					return done(err);
				}

				var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

				if (!username.match(pattern)) {
					return done(null, false, { message: "El mail de usuario es inválido" });
				}

				if (user) {
					return done(null, false, { message: "El mail de usuario ya existe" });
				}

				if (req.body.password2 != password) {
					return done(null, false, { message: "Las contraseñas no coinciden" });
				}

				if (req.body.edad < 18) {
					return done(null, false, { message: "La edad es inválida" });
				}

				if (req.body.prefijo > 998) {
					return done(null, false, { message: "El prefijo es inválido" });
				}

				if (req.body.prefijo.includes("+")) {
					return done(null, false, { message: "Eliminar el simbolo '+'" });
				}

				const newUser = {
					username: username,
					password: createHash(password),
					usuario: req.body.usuario,
					direccion: req.body.direccion,
					edad: req.body.edad,
					prefijo: req.body.prefijo,
					telefono: req.body.telefono,
					avatar: req.body.avatar,
				};
				esquemaUsuarios.create(newUser, (err, userWithId) => {
					if (err) {
						return done(err);
					}
					logger.info("usuario nuevo registrado");

					const CarritoNuevo = new carritoMongo();
					CarritoNuevo.crear(userWithId);

					let cuerpo = `
					<h3>Usuario nuevo:</h3>
					<p>mail: ${userWithId.username}</p>
					<p>nombre: ${userWithId.usuario}</p>
					<p>edad: ${userWithId.edad}</p>
					<p>dirección: ${userWithId.direccion}</p>
					<p>telefono: +${userWithId.prefijo}-${userWithId.telefono}</p>
					<p>avatar: ${userWithId.avatar}</p>`;

					sendMail("NUEVO REGISTRO", cuerpo);
					return done(null, userWithId);
				});
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	esquemaUsuarios.findById(id, done);
});

//PASSPORT LOGIN FUNCTION

function LOGIN(req, res, next) {
	passport.authenticate("login", function (err, user, info) {
		if (!user) {
			return res.json({ success: false, message: "authentication failed", info: info.message });
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			logger.info(`peticion a ruta /login con metodo POST`);
			return res.json({ success: true, message: "authentication succeeded" });
		});
	})(req, res, next);
}

//PASSPORT SIGNUP FUNCTION

function SIGNUP(req, res, next) {
	passport.authenticate("signup", function (err, user, info) {
		if (!user) {
			return res.json({ success: false, message: "registration failed", info: info.message });
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			logger.info(`peticion a ruta /signup con metodo POST`);
			return res.json({ success: true, message: "registration succeeded" });
		});
	})(req, res, next);
}

module.exports = { LOGIN, SIGNUP, passport };
