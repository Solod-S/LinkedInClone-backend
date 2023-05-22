const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer, userTransformer } = require("../../helpers/index");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const user = await User.findById({ _id: userId });

  if (!user) {
    throw HttpError(404, "Not found");
  }

  const posts = await Post.find({ owner: userId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "likes",
      select: "owner type",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id surname name avatarURL" },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
        {
          path: "mediaFiles",
          select: "url type owner",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
      ],
    });

  res.status(200).json({
    status: "succes",
    data: { user: userTransformer(user), posts: posts.map((post) => postTransformer(post)) },
  });
};

module.exports = getUserById;
