const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById({ _id: postId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "likes",
      select: "owner type",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id surname name avatarURL" },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
        {
          path: "mediaFiles",
          select: "url type owner",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
      ],
    })
    .populate({ path: "owner", select: "_id surname name avatarURL" });

  if (!post) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: "success",
    message: "We successfully found the post",
    data: { post: postTransformer(post) },
  });
};

module.exports = getPostById;
