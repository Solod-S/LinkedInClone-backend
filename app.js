const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const options = {
  dotfiles: "ignore", // allow, deny, ignore
  etag: true,
  extensions: ["htm", "html"],
  index: false, // to disable directory indexing
  maxAge: "7d",
  redirect: false,
  setHeaders: function (res, path, stat) {
    // add this header to all static responses
    res.set("x-timestamp", Date.now());
  },
};

const swaggerDocument = require("./routes/swagger/openapi.json");
const {
  authRouter,
  usersRouter,
  ownPostsRouter,
  postsRouter,
  mediaFilesRouter,
  likesRouter,
  favoritesRouter,
  subscriptionsRouter,
  commentsRouter,
  skillsRouter,
  experiencesRouter,
  educationsRouter,
  languagesRouter,
  companiesRouter,
  ownPublicationsRouter,
  publicationsRouter,
  ownJobsRouter,
  jobsRouter,
} = require("./routes/api/");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/own-posts", ownPostsRouter);
app.use("/posts", postsRouter);
app.use("/media-files", mediaFilesRouter);
app.use("/likes", likesRouter);
app.use("/favorites", favoritesRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/comments", commentsRouter);
app.use("/skills", skillsRouter);
app.use("/experiences", experiencesRouter);
app.use("/educations", educationsRouter);
app.use("/languages", languagesRouter);
app.use("/companies", companiesRouter);
app.use("/own-publications", ownPublicationsRouter);
app.use("/publications", publicationsRouter);
app.use("/own-jobs", ownJobsRouter);
app.use("/jobs", jobsRouter);
app.use(express.static("public", options));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
