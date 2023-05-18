const human = require("human-time");

const commentTransformer = (comment) => {
  return {
    description: comment.description,
    likes: comment.likes,
    mediaFiles: comment.mediaFiles,
    owner: comment.owner,
    _id: comment._id,
    postId: comment.postId,
    postedAtHuman: human(comment.createdAt),
  };
};

module.exports = commentTransformer;
