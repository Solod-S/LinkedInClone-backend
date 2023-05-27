const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const deleteOwnPost = async (req, res, next) => {
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

  await User.updateMany({ favorite: { $elemMatch: { $eq: post._id } } }, { $pull: { favorite: post._id } });

  res.json({ status: "success", data: { deletedPost: postTransformer(result) } });
};

module.exports = deleteOwnPost;
