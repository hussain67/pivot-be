const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
app.use(cors());
require("dotenv").config();

const home = require("./routes/home");
const apiRouter = require("./routes/apiInfo");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const presentationsRouter = require("./routes/presentationRoutes");
const { authenticateUser } = require("./middleware/authentication");

const invalideUrlMiddleware = require("./middleware/invalid-url");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1", home);
app.use("/public", express.static("public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/presentations", authenticateUser, presentationsRouter);
//app.use("/api/v1", apiRouter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use("*", invalideUrlMiddleware);
app.use(errorHandlerMiddleware);

const http = require("http");
app.server = http.createServer(app);
const options = {
  cors: true,
  origins: ["http://localhost:3000/"]
};
io = require("socket.io")(app.server, options);

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
