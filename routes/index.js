var express = require("express");
var router = express.Router();
const { getProductos } = require("../persistencia/mongoProductos");

/* GET home page. */
router.get("/", function (req, res) {
	getProductos().then((data) => {
		let existe = false;
		data.length == 0 ? (existe = false) : (existe = true);
		let resp = JSON.parse(JSON.stringify(data));
		res.render("index");
	});
});

module.exports = router;
