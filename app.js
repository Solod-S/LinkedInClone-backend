const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./routes/swagger/openapi.json");
const {
  userRouter,
  ownPostsRouter,
  postsRouter,
  mediaFilesRouter,
  likesRouter,
  favoritesRouter,
  commentsRouter,
  skillsRouter,
  experienceRouter,
} = require("./routes/api/");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRouter);
app.use("/own-posts", ownPostsRouter);
app.use("/posts", postsRouter);
app.use("/media-files", mediaFilesRouter);
app.use("/likes", likesRouter);
app.use("/favorites", favoritesRouter);
app.use("/comments", commentsRouter);
app.use("/skills", skillsRouter);
app.use("/experiences", experienceRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
