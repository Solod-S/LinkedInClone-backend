const { Like, Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const deleteLike = async (req, res, next) => {
  const { _id } = req.user;
  const { likeId } = req.params;

  const like = await Like.findById({ _id: likeId });

  if (!like || (await like.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Like.findByIdAndDelete({ _id: likeId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await Post.updateOne({ likes: { $elemMatch: { $eq: like._id } } }, { $pull: { likes: like._id } });
  await Comment.updateOne({ likes: { $elemMatch: { $eq: like._id } } }, { $pull: { likes: like._id } });

  res.json({ status: "success", data: { deletedLike: result } });
};

module.exports = deleteLike;
