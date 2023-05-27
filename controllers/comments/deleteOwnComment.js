const { Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { commentTransformer } = require("../../helpers/index");

const deleteOwnComment = async (req, res, next) => {
  const { _id } = req.user;
  const { commentId } = req.params;

  const comment = await Comment.findById({ _id: commentId });

  if (!comment || (await comment.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Comment.findByIdAndDelete({ _id: commentId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await Post.updateOne({ comments: { $elemMatch: { $eq: comment._id } } }, { $pull: { comments: comment._id } });
  await Comment.updateOne({ comments: { $elemMatch: { $eq: comment._id } } }, { $pull: { comments: comment._id } });

  res.json({ status: "success", data: { deletedComment: commentTransformer(result) } });
};

module.exports = deleteOwnComment;
