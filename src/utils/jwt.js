const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "28d" });
  return token;
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// const attachCookiesToResponse = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;
//   //const oneDay = 20000;
//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),

//     secure: process.env.NODE_ENV === "production",
//     signed: "true"
//   });
// };
const attachCookiesToResponse = ({ req, res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  //const oneDay = 20000;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),

    secure: req.secure || req.headers("x-forwarded-proto") === "https",
    signed: "true"
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
};
