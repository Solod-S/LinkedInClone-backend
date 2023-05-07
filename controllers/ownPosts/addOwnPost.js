const { Post } = require("../../models");

const { ownPostTransformer } = require("../../helpers/index");

const addOwnPost = async (req, res, next) => {
  const newPost = await Post.create({
    ...req.body,
    owner: req.user._id,
  });

  res.json({ status: "success", data: { newPost: ownPostTransformer(newPost) } });
};

module.exports = addOwnPost;
