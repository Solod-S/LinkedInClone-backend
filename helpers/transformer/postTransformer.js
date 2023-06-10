const human = require("human-time");

const postTransformer = ({ description, likes, comments, mediaFiles, owner, _id, createdAt, updatedAt }) => {
  return {
    _id,
    description,
    likes,
    comments,
    mediaFiles,
    postedAtHuman: human(createdAt),
    createdAt,
    updatedAt,
    owner,
  };
};

module.exports = postTransformer;
