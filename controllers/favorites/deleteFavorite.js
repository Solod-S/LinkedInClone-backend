const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const deleteFavorite = async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });
  const post = await Post.findById({ _id: postId });

  if (!user.favorite.includes(postId)) {
    throw HttpError(404, `Sorry, we couldnt find post id in favorites`);
  }

  if (!post) {
    throw HttpError(404, `Post id is invalid`);
  }

  user.favorite.pull(post._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: `Succes, post was removed from your favorites`,
  });
};

module.exports = deleteFavorite;
