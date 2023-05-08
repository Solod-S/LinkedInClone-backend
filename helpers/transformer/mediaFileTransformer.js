const human = require("human-time");

const mediaFileTransformer = (mediaFile) => {
  return {
    type: mediaFile.type,
    url: mediaFile.url,
    providerPublicId: mediaFile.providerPublicId,
    owner: mediaFile.owner,
    postId: mediaFile.postId,
    _id: mediaFile._id,
    postedAtHuman: human(mediaFile.createdAt),
  };
};

module.exports = mediaFileTransformer;
