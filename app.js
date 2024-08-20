require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const Cors = require("cors");
const morgan = require("morgan");

const fs = require("fs");
require("express-async-errors");
const https = require("https");

const connectDB = require("./config/db.config");
app.use(Cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>I wanna Thanks Me</h1>"
  );
});
// /
//server For Chat
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server);

// io.on("connection", (socket) => {
//   console.log("A user connected");
// });

//Middleware
const authMiddleware = require("./middleware/userAuth");
//Routes
const User = require("./routes/user");
const PrimaryRoute = require("./routes/primary");
const SecondaryRoute = require("./routes/secondary");
const TertiaryRoute = require("./routes/tertiary");
const ProductRoute = require("./routes/product");
const Slider = require("./routes/slider");
const AddressRoute = require("./routes/address");
const chatRoutes = require("./routes/chat");
const KeepInTouchRoutes = require("./routes/keepInTouch");
const ContactUsRoutes = require("./routes/contactUs");
//AppUse//

app.use("/api/v1", User);
app.use("/api/v1", Slider);
app.use("/api/v1", AddressRoute);
app.use("/api/v1", TertiaryRoute);
app.use("/api/v1", PrimaryRoute);
app.use("/api/v1", SecondaryRoute);
app.use("/api/v1", ProductRoute);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", KeepInTouchRoutes);
app.use("/api/v1", ContactUsRoutes);

//server
let server = app;

if (process.env.NODE_ENV === "production") {
  const options = {
    cert: fs.readFileSync("/etc/letsencrypt/live/girlines.com/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/girlines.com/privkey.pem"),
    rejectUnauthorized: false,
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

// server = http.createServer(app);

const setupSocket = require("./socket");
const keepIntouchRouter = require("./routes/keepInTouch");

setupSocket(server);

const start = async () => {
  try {
    // await connectDB("mongodb://0.0.0.0:27017/GirlLine");
    await connectDB(process.env.MONGO_URI);

    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
const port = process.env.PORT || 5050;
server.listen(port, () =>
  console.log(`Server is running and listenning on ${port}`)
);

start();
