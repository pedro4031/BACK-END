const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");
const Usuarios = require("../database/models/usuario");
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

//PASSPORT LOGIN

passport.use(
	"login",
	new LocalStrategy((username, password, done) => {
		Usuarios.findOne({ username }, (err, user) => {
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

//PASSPORT SIGN UP

passport.use(
	"signup",
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		(req, username, password, done) => {
			Usuarios.findOne({ username: username }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, false, { message: "El mail de usuario ya existe" });
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
				Usuarios.create(newUser, (err, userWithId) => {
					if (err) {
						return done(err);
					}
					logger.info("usuario nuevo registrado");

					const CarritoNuevo = new carritoMongo();
					CarritoNuevo.crear(userWithId["_id"]);

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
	Usuarios.findById(id, done);
});

module.exports = passport;
