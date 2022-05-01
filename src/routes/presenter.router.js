const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const { logIn, register, findPresenter } = require("../controllers/presenter.controller");

router.post("/register", register);
router.post("/login", logIn);
router.get("/getPresenter", auth, findPresenter);

module.exports = router;
