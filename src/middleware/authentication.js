const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, userId, role } = decoded;
    req.user = { name, userId, role };
    console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
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
