const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById({ _id: postId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id name avatarURL" },
    })
    .populate({ path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id name avatarURL" },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } },
        { path: "mediaFiles", select: "url type owner", populate: { path: "owner", select: "_id name avatarURL" } },
      ],
    });

  if (!post) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: "succes",
    data: { post: postTransformer(post) },
  });
};

module.exports = getPostById;
