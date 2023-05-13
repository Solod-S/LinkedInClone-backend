const { Like, Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const removeLike = async (req, res, next) => {
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

  await Post.updateOne({ likes: { $elemMatch: { $eq: likeId } } }, { $pull: { likes: likeId } });
  await Comment.updateOne({ likes: { $elemMatch: { $eq: likeId } } }, { $pull: { likes: likeId } });
  res.json({ status: "success", data: { deletedLike: result } });
};

module.exports = removeLike;
