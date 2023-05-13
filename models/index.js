const { User, userSchemas } = require("./users");
const { Post, postSchemas } = require("./posts");
const { MediaFile, mediaFileSchemas } = require("./mediaFiles");
const { Like, likeSchemas } = require("./likes");
const { Comment, commentSchemas } = require("./comments");

module.exports = {
  User,
  userSchemas,
  Post,
  postSchemas,
  MediaFile,
  mediaFileSchemas,
  Like,
  likeSchemas,
  Comment,
  commentSchemas,
};
