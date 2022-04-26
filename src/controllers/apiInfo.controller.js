const endpoints = require("../../endpoints.json");

const apiInfo = async (req, res, next) => {
  try {
    res.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
module.exports = { apiInfo };
