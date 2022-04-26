const express = require("express");
const router = express.Router();
const { apiInfo } = require("../controllers/apiInfo.controller");

router.get("/", apiInfo);

module.exports = router;
