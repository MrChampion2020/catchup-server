const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const PostLike = require("./models/PostLike");
const Post = require("./models/Post");

dotenv.config();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
 
  cors: {
    origin: ['http://localhost:3000', 'https://catchup-eight.vercel.app'],  // replace with actual domains
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

/*mongoose.connect(
  process.env.MONGO_URI,
  {},
  () => {
    console.log("MongoDB connected");
  }
);
*/

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

httpServer.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on Port:5000');
});

app.use(express.json());
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
/*
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}*/
