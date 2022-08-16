const { isTokenValid } = require("../utils");
//const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  //console.log(token);
  if (!token) {
    //throw new CustomError.UnauthenticatedError("Authentication invalid");
    res.status(401).json("No token present");
    return;
  }
  try {
    const payload = isTokenValid({ token });
    const { name, userId, role } = payload;
    req.user = { name, userId, role };
    next();
  } catch (error) {
    next(error);
  }
};

const autorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("Unauthorized to access this route!");
    }
    next();
  };
};

module.exports = { authenticateUser, autorizePermissions };
