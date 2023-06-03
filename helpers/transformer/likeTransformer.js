const human = require("human-time");

const likeTransformer = (like) => {
  return {
    _id: like._id,
    type: like.type,
    location: like.location,
    owner: like.owner,
    postId: like.postId,
    commentId: like.commentId,
    postedAtHuman: human(like.createdAt),
  };
};

module.exports = likeTransformer;
