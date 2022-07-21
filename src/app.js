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
const scheduleRouter = require("./routes/scheduleRoutes");
const { authenticateUser } = require("./middleware/authentication");

const invalideUrlMiddleware = require("./middleware/invalid-url");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { savePresenter, removePresenter, getIdOfPresenter } = require("./utils/presenter");
const { addUser, getUser, removeUser, getPresenter, getUsersInRoom } = require("./utils/users");
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1", home);
app.use("/public", express.static("public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/presentations", authenticateUser, presentationsRouter);
app.use("/api/v1/schedule", scheduleRouter);
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

  socket.on("join", ({ username, room }, callback) => {
    //console.log(username, room, socket.id);
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    // console.log(user);
    //return res;
    // socket.broadcast.to(room).emit("join-message", ` ${username} has joined`);
    callback(null, user);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    //removePresenter(socket.id);
  });

  socket.on("current-slide", ({ slide }) => {
    //console.log(`${slide}-current presentation slide`);
    const user = getUser(socket.id);
    //console.log(user.room, "Room");
    // io.emit("current-slide", obj);
    socket.broadcast.to(user.room).emit("current-slide", slide);
  });

  socket.on("poll-started", ({ poolQuestion }) => {
    const user = getUser(socket.id);
    socket.broadcast.to(user.room).emit("new-poll", poolQuestion);
  });

  socket.on("answer", ({ room, answer }) => {
    //const id = getIdOfPresenter(room);
    // console.log(id);
    const presenter = getPresenter(room);
    io.to(presenter.id).emit("new-answer", answer);
  });

  socket.on("chart-data", ({ chartData, room }) => {
    socket.broadcast.to(room).emit("new-chart-data", chartData);
    console.log(chartData);
    console.log(room);
  });

  socket.on("poll-result", room => {
    console.log(result);
    socket.to(room).emit("result", result);
  });
});

module.exports = app;
