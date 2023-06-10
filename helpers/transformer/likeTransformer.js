const human = require("human-time");

const likeTransformer = ({ _id, type, location, owner, postId, commentId, createdAt, updatedAt }) => {
  return {
    _id,
    postId,
    commentId,
    type,
    location,
    postedAtHuman: human(createdAt),
    createdAt,
    updatedAt,
    owner,
  };
};

module.exports = likeTransformer;
