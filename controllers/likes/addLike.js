const { Like, Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const addLike = async (req, res, next) => {
  const { _id } = req.user;
  const { location, type } = req.body;

  const locationId = location === "posts" ? req.body.postId : req.body.commentId;
  const serachParams = location === "posts" ? { postId: req.body.postId } : { commentId: req.body.commentId };
  const id = location === "posts" ? req.body.postId : req.body.commentId;

  const Model = location === "posts" ? Post : Comment;

  const data = await Model.findById({ _id: locationId });

  if (!data) {
    throw HttpError(404, "Not found");
  }
  const likeIsExist = await Like.findOne({ ...serachParams, owner: _id });

  if (likeIsExist) {
    const updatedLike = await Like.findOneAndUpdate({ _id: likeIsExist._id }, { type });

    updatedLike.type = type;

    res.json({ status: "success", data: { like: updatedLike } });
  } else {
    const like = await Like.create({
      ...req.body,
      owner: _id,
    });
    await Model.findByIdAndUpdate({ _id: id }, { $push: { likes: like._id } }, { new: true });

    res.json({ status: "success", data: { like } });
  }
};

module.exports = addLike;
