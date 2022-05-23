const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const http = require("http");
//const fileUpload = require("express-fileupload")
app.server = http.createServer(app);

const options = {
  cors: true
  //origins: ["http://localhost:3000/presentations/"]
};
io = require("socket.io")(app.server, options);
const home = require("./routes/home");
const apiRouter = require("./routes/apiInfo");
const presentersRouter = require("./routes/presenters.route");
const presentationsRouter = require("./routes/presentations.route");
const auth = require("./middleware/authentication");

const invalideUrlMiddleware = require("./middleware/invalid-url");
const errorHandlerMiddleware = require("./middleware/error-handler");
//console.log(invalideUrlMiddleware);
app.use(express.json());
//app.use(fileUpload)

app.use("/", home);
app.use("/public", express.static("public"));
app.use("/api/v1/presenters", presentersRouter);
app.use("/api/v1/presentations", auth, presentationsRouter);
app.use("/v1/api", apiRouter);

app.use("*", invalideUrlMiddleware);
app.use(errorHandlerMiddleware);
//app.use(handleServerErrors);
io.on("connection", socket => {
  console.log(`User connected ${socket.id}`);

  socket.on("student_submit_response", data => {
    console.log(data, "<<form data from student fe");
    io.emit("new_response", data);
  });

  socket.on("teacher_current_slide", slideId => {
    console.log(`${slideId}-current presentation slide`);
    io.emit("current_slide", slideId);
  });

  socket.on("teacher_slide_stop", slideId => {
    console.log(`${slideId}-Stopped`);
    io.emit("current_slide_stopped", slideId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = app;
