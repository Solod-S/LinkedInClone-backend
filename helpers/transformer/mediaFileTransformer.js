const human = require("human-time");

const mediaFileTransformer = ({
  type,
  url,
  providerPublicId,
  owner,
  location,
  postId,
  commentId,
  _id,
  createdAt,
  updatedAt,
}) => ({
  _id,
  postId,
  commentId,
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
