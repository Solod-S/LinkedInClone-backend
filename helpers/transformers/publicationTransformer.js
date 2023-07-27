const human = require("human-time");

const publicationTransformer = ({ description, likes, comments, mediaFiles, owner, _id, createdAt, updatedAt }) => ({
  _id,
  description,
  likes,
  comments,
  mediaFiles,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = publicationTransformer;
