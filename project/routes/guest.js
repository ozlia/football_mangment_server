const auth = require("./auth");
// const search = require("./search");
var express = require("express");
var router = express.Router();
router.use("/auth", auth);
// app.use(search);

module.exports = router;

