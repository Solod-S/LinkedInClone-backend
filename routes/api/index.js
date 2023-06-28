const usersRouter = require("./user");
const ownPostsRouter = require("./ownPosts");
const mediaFilesRouter = require("./mediaFiles");
const likesRouter = require("./likes");
const favoritesRouter = require("./favorites");
const commentsRouter = require("./comments");
const postsRouter = require("./posts");
const skillsRouter = require("./skills");
const experiencesRouter = require("./experiences");
const educationsRouter = require("./educations");
const languagesRouter = require("./languages");
const companiesRouter = require("./companies");
const ownPublicationsRouter = require("./ownPublication");

module.exports = {
  usersRouter,
  ownPostsRouter,
  mediaFilesRouter,
  likesRouter,
  favoritesRouter,
  commentsRouter,
  postsRouter,
  skillsRouter,
  experiencesRouter,
  educationsRouter,
  languagesRouter,
  companiesRouter,
  ownPublicationsRouter,
};
