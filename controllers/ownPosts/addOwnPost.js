const { Post, User } = require("../../models");

const { postTransformer } = require("../../helpers/index");

const addOwnPost = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  const newPost = await Post.create({
    ...req.body,
    owner: req.user._id,
  });

  user.posts.push(newPost._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Post successfully created",
    data: { post: postTransformer(newPost) },
  });
};

module.exports = addOwnPost;
