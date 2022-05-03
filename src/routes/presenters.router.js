const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const { login, logout, register, findPresenter } = require("../controllers/presenters.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/getPresenter", auth, findPresenter);

module.exports = router;
