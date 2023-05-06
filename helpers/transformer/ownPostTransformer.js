const human = require("human-time");

const ownPostTransformer = (post) => {
  return {
    image: post.image,
    video: post.video,
    description: post.description,
    likes: post.likes,
    comments: post.comments,
    owner: post.owner,
    _id: post._id,
    postedAtHuman: human(post.createdAt),
  };
};

module.exports = ownPostTransformer;
