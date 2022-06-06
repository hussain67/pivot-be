const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log(req.cookies);
  console.log(req.signedCookies);
  try {
    res.send("Welcome to Pivot api");
  } catch (err) {
    next(error);
  }
});
module.exports = router;
