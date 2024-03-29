const { Post, Comment, Like, MediaFile, Publication } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const deleteOwnComment = async (req, res, next) => {
  const { _id } = req.user;
  const { commentId } = req.params;

  const comment = await Comment.findById({ _id: commentId });

  if (!comment || (await comment.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Comment.findByIdAndDelete({ _id: commentId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location createdAt updatedAt",
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
    })
    .populate({
      path: "owner",
      select: "_id surname name avatarURL",
    });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await Post.updateOne({ comments: { $elemMatch: { $eq: comment._id } } }, { $pull: { comments: comment._id } });
  await Publication.updateOne({ comments: { $elemMatch: { $eq: comment._id } } }, { $pull: { comments: comment._id } });
  await Comment.updateOne({ comments: { $elemMatch: { $eq: comment._id } } }, { $pull: { comments: comment._id } });
  await MediaFile.deleteMany({ _id: { $in: comment.mediaFiles } });
  await Like.deleteMany({ _id: { $in: comment.likes } });

  res.json({
    status: "success",
    message: "Comment successfully deleted",
    data: { comment: transformers.commentTransformer(result) },
  });
};

module.exports = deleteOwnComment;
