const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const updateOwnPost = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { postId } = req.params;

  const post = await Post.findById({ _id: postId });

  if (!post || (await post.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true, // return updated post
  });

  if (!updatedPost) {
    throw HttpError(404, "Not found");
  }

  res.json({ status: "success", message: "Successfully updated a post", data: { post: postTransformer(updatedPost) } });
};

module.exports = updateOwnPost;
