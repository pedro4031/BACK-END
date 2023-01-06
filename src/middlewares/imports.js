const { checkAdmin } = require("./checkAdmin");
const { checkAuthentication } = require("./checkAuthentication");
const { SIGNUP, LOGIN, passport } = require("./passportConfig");

module.exports = { checkAdmin, checkAuthentication, LOGIN, SIGNUP, passport };
