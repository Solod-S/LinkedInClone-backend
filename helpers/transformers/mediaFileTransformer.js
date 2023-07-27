const human = require("human-time");

const mediaFileTransformer = ({
  type,
  url,
  providerPublicId,
  owner,
  location,
  postId,
  commentId,
  educationId,
  experienceId,
  userId,
  _id,
  createdAt,
  updatedAt,
  publicationId,
}) => ({
  _id,
  postId,
  commentId,
  educationId,
  experienceId,
  userId,
  publicationId,
  type,
  location,
  url,
  providerPublicId,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = mediaFileTransformer;
