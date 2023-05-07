const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { ownPostTransformer } = require("../../helpers/index");

const removeOwnPost = async (req, res, next) => {
  const { postId } = req.params;
  const result = await Post.findByIdAndDelete({ _id: postId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ status: "success", data: { deletedPost: ownPostTransformer(result) } });
};

module.exports = removeOwnPost;
