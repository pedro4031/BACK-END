const { checkAdmin } = require("./checkAdmin");
const { checkAuthentication } = require("./checkAuthentication");
const passport = require("./passportConfig");

module.exports = { checkAdmin, checkAuthentication, passport };
