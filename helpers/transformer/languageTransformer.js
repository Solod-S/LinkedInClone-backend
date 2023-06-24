const human = require("human-time");

const languageTransformer = ({ language, level, owner, _id, postId, createdAt, updatedAt }) => ({
  _id,
  language,
  level,
  postId,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = languageTransformer;
