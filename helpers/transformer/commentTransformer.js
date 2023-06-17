const human = require("human-time");

const commentTransformer = ({ description, likes, mediaFiles, owner, _id, postId, createdAt, updatedAt }) => ({
  _id,
  postId,
  description,
  likes,
  mediaFiles,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = commentTransformer;
