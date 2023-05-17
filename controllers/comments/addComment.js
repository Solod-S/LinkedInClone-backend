const { Comment, Post } = require("../../models");

const { commentTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const addComment = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.body;

  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw HttpError(404, "Not found");
  }

  const comment = await Comment.create({
    ...req.body,
    owner: _id,
  });

  // const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });

  res.json({ status: "success", data: { comment: commentTransformer(comment) } });
};

module.exports = addComment;
