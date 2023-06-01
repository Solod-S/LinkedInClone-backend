const { User, Post, Comment, MediaFile, Like } = require("../../models");

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
  await User.updateOne({ posts: { $elemMatch: { $eq: post._id } } }, { $pull: { posts: post._id } });
  await Comment.deleteMany({ _id: { $in: post.comments } });
  await MediaFile.deleteMany({ _id: { $in: post.mediaFiles } });
  await Like.deleteMany({ _id: { $in: post.likes } });

  res.json({ status: "success", message: "Post successfully deleted", data: { post: postTransformer(result) } });
};

module.exports = deleteOwnPost;
