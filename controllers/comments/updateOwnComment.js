const { Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { commentTransformer } = require("../../helpers/index");

const updateOwnComment = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { commentId } = req.params;

  const comment = await Comment.findById({ _id: commentId });

  if (!comment || (await comment.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(commentId, updateData, {
    new: true, // return updated comment
  }).populate({
    path: "mediaFiles",
    select: "url type providerPublicId location createdAt updatedAt"
  }).populate({
    path: "likes",
    select: "owner type createdAt updatedAt",
  }).populate({
    path: "owner",
    select:
      "_id surname name avatarURL",
  });

  if (!updatedComment) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Comment successfully updated",
    data: { comment: commentTransformer(updatedComment) },
  });
};

module.exports = updateOwnComment;
