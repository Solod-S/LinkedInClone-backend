const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const addFavorite = async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });
  const post = await Post.findById({ _id: postId });

  if (user.favorite.includes(postId)) {
    throw HttpError(409, `Sorry, the post was added to favorites before`);
  }

  if (!post) {
    throw HttpError(404, `Post ID is invalid or not found`);
  }

  user.favorite.push(post._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Data successfully added to your favorites",
    data: { post: postTransformer(post) },
  });
};

module.exports = addFavorite;
