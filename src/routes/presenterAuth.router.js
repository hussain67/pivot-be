const express = require("express");
const router = express.Router();

const { logIn, register } = require("../controllers/presenterAuth.controller");

router.post("/register", register);
router.post("/login", logIn);

module.exports = router;
