const { User } = require("../../models");
const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { userTransformer } = require("../../helpers/index");
const { ownPostTransformer } = require("../../helpers/index");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw HttpError(404, "Not found");
  }

  const posts = await Post.find({ owner: userId }).populate({
    path: "mediaFiles",
    select: "owner _id type url providerPublicId postId ",
  });

  res.status(200).json({
    status: "succes",
    data: { user: userTransformer(user), posts: posts.map((post) => ownPostTransformer(post)) },
  });
};

module.exports = getUserById;
