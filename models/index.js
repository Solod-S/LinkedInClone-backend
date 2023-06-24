const { User, userSchemas } = require("./users");
const { Post, postSchemas } = require("./posts");
const { Skill, skillsSchemas } = require("./skils");
const { MediaFile, mediaFileSchemas } = require("./mediaFiles");
const { Like, likeSchemas } = require("./likes");
const { Comment, commentSchemas } = require("./comments");
const { Experience, experienceSchemas } = require("./experience");
const { Education, educationsSchemas } = require("./educations");
const { Language, languagesSchemas } = require("./language");

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
  Experience,
  experienceSchemas,
  Education,
  educationsSchemas,
  Language,
  languagesSchemas,
};
