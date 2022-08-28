const express = require("express");
const router = express.Router();
const { apiInfo } = require("../controllers/apiInfoController");

router.get("/", apiInfo);

module.exports = router;
