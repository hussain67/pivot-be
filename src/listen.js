require("dotenv").config();
const { PORT = 9090 } = process.env;
const app = require("./app");
const connectDB = require("./db/connect");

const url = process.env.MONGO_URI_DEV;
connectDB(url).then(() => {
  app.server.listen(PORT, err => {
    if (err) throw err;
    console.log(`Server listening on port ${PORT} ....`);
  });
});
