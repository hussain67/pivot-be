require("dotenv").config();
const { PORT = 9090 } = process.env;
const app = require("./app");
//console.log(app.get("env"));
const connectDB = require("./db/connect");
/*
const options = {
  cors: true,
  origins: [process.env.TEACHER_URL, process.env.STUDENT_URL]
};
*/
const url = process.env.MONGO_URI_DEV;
connectDB(url).then(() => {
  app.server.listen(PORT, err => {
    if (err) throw err;
    console.log(`Server listening on port ${PORT} ....`);
  });
});
