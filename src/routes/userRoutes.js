const express = require("express");
const router = express.Router();

const { authenticateUser, autorizePermissions } = require("../middleware/authentication");
const { getAllUsers, getSingleUser, showUser, deleteUser, updateUser } = require("../controllers/userController");

router.route("/").get(authenticateUser, autorizePermissions("admin", "user"), getAllUsers);

router.route("/user").get(authenticateUser, showUser);
router.route("/user").delete(authenticateUser, deleteUser);
router.route("/user").patch(authenticateUser, updateUser);
//router.route("/password").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
