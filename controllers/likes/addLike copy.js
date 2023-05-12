const { Like, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const addLike = async (req, res, next) => {
  const { postId } = req.body;

  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw HttpError(404, "Not found");
  }

  if (post.likes.includes(req.user._id)) {
    // код для случая, когда пользователь уже поставил лайк

    const updatedPost = await Post.findOneAndUpdate({ type: "dislike" });
    res.json({ status: "success", data: { post: updatedPost } });
  } else {
    const like = await Like.create({
      ...req.body,
      owner: req.user._id,
      type: "like",
    });

    const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } }, { new: true });
    res.json({ status: "success", data: { like, post: updatedPost } });
  }
};

module.exports = addLike;
