const { User, userSchemas } = require("./users");
const { Post, postSchemas } = require("./posts");
const { Skill, skillsSchemas } = require("./skils");
const { MediaFile, mediaFileSchemas } = require("./mediaFiles");
const { Like, likeSchemas } = require("./likes");
const { Comment, commentSchemas } = require("./comments");

module.exports = {
  User,
  userSchemas,
  Post,
  postSchemas,
  Skill,
  skillsSchemas,
  MediaFile,
  mediaFileSchemas,
  Like,
  likeSchemas,
  Comment,
  commentSchemas,
};
