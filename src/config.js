//MONGODB

const { connect } = require("mongoose");

async function connectMG() {
	try {
		return await connect("mongodb://localhost:27017/ecommerce", { useNewUrlParser: true });
	} catch (e) {
		console.log(e);
	}
}

//FIREBASE

const admin = require("firebase-admin");

const serviceAccount = require("../backend-ecommerce-2d3f3-firebase-adminsdk-wepja-661c173a4f.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = { admin, connectMG };
