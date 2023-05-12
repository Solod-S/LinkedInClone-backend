const { Like, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const addLike = async (req, res, next) => {
  const { postId } = req.body;

  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw HttpError(404, "Not found");
  }

  const likeIsExist = await Like.findOne({ postId });

  if (likeIsExist) {
    const updatedLike = await Like.findOneAndUpdate({ type: req.body.type });
    updatedLike.type = req.body.type;

    res.json({ status: "success", data: { like: updatedLike, post } });
  } else {
    console.log("!likeIsExist");
    const like = await Like.create({
      ...req.body,
      owner: req.user._id,
    });
    const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } }, { new: true });

    res.json({ status: "success", data: { like, post: updatedPost } });
  }
};

module.exports = addLike;
