const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const { login, logout, register, findPresenter, deletePresenter, updatePresenter } = require("../controllers/presenters.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, findPresenter);
router.delete("/me", auth, deletePresenter);
router.patch("/me", auth, updatePresenter);

module.exports = router;
