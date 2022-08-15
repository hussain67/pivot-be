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
app.enable("trust proxy");

const home = require("./routes/home");
const apiRouter = require("./routes/apiInfo");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const presentationsRouter = require("./routes/presentationRoutes");
const scheduleRouter = require("./routes/scheduleRoutes");
const { authenticateUser } = require("./middleware/authentication");

const invalideUrlMiddleware = require("./middleware/invalid-url");
const errorHandlerMiddleware = require("./middleware/error-handler");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use("*", invalideUrlMiddleware);
app.use(errorHandlerMiddleware);

const http = require("http");
app.server = http.createServer(app);
const options = {
  cors: true,
  origins: ["http://localhost:3000"]
};
io = require("socket.io")(app.server, options);

io.on("connection", socket => {
  console.log(`User connected ${socket.id}`);

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    callback(null, user);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

  socket.on("remove-user", () => {
    removeUser(socket.id);
  }),
    socket.on("current-slide", ({ slide }) => {
      const user = getUser(socket.id);
      if (user) {
        socket.broadcast.to(user.room).emit("current-slide", { slide, room: user.room });
      }
    });

  socket.on("poll-started", ({ poolQuestion }) => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("new-poll", poolQuestion);
    }
  });

  socket.on("answer", ({ room, answer }) => {
    const presenter = getPresenter(room);
    if (presenter) {
      io.to(presenter.id).emit("new-answer", answer);
    }
  });

  socket.on("poll-result", ({ chartData, totalCount, room }) => {
    socket.broadcast.to(room).emit("new-poll-result", { chartData, totalCount });
  });
});

module.exports = app;
