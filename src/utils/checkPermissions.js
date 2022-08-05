const customErrors = require("../errors");

const checkPermissions = (requser, resourceUserId) => {
  if (requser.role === "admin") return;
  if (requser.userId === resourceUserId.toString()) return;
  throw new customErrors.UnauthorizedError("Not authorized to access this route");
};

module.exports = checkPermissions;
