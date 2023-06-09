const human = require("human-time");

const postTransformer = ({ description, likes, comments, mediaFiles, owner, _id, createdAt, updatedAt }) => {
  return {
    description,
    likes,
    comments,
    mediaFiles,
    owner,
    _id,
    postedAtHuman: human(createdAt),
    createdAt,
    updatedAt,
  };
};

module.exports = postTransformer;
