const { User, userSchemas } = require("./users");
const { AccessToken, tokenSchemas } = require("./accessToken");
const { Post, postSchemas } = require("./posts");
const { Skill, skillsSchemas } = require("./skills");
const { MediaFile, mediaFileSchemas } = require("./mediaFiles");
const { Like, likeSchemas } = require("./likes");
const { Comment, commentSchemas } = require("./comments");
const { Experience, experienceSchemas } = require("./experience");
const { Education, educationsSchemas } = require("./educations");
const { Language, languagesSchemas } = require("./language");
const { Company, companySchemas } = require("./companies");
const { Publication, publicationSchemas } = require("./publications");
const { Job, JobSchemas } = require("./jobs");

module.exports = {
  User,
  userSchemas,
  AccessToken,
  tokenSchemas,
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
  Company,
  companySchemas,
  Publication,
  publicationSchemas,
  Job,
  JobSchemas,
};
