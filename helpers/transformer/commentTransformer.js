const human = require("human-time");

const commentTransformer = ({
  description,
  location,
  likes,
  mediaFiles,
  owner,
  _id,
  postId,
  publicationId,
  createdAt,
  updatedAt,
}) => ({
  _id,
  postId,
  publicationId,
  description,
  location,
  likes,
  mediaFiles,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = commentTransformer;
