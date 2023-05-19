const human = require("human-time");

const postTransformer = (post) => {
  return {
    description: post.description,
    likes: post.likes,
    comments: post.comments,
    mediaFiles: post.mediaFiles,
    owner: post.owner,
    _id: post._id,
    postedAtHuman: human(post.createdAt),
  };
};

module.exports = postTransformer;