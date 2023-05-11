const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { ownPostTransformer } = require("../../helpers/index");

const removeOwnPost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;

  const post = await Post.findById({ _id: postId });

  if (!post || (await post.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Post.findByIdAndDelete({ _id: postId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ status: "success", data: { deletedPost: ownPostTransformer(result) } });
};

module.exports = removeOwnPost;
