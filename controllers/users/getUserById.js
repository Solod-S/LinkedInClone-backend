const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer, userTransformer } = require("../../helpers/index");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const user = await User.findById({ _id: userId })
    .populate({
      path: "posts",
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
          select: "owner description likes mediaFiles createdAt updatedAt",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
        {
          path: "mediaFiles",
          select: "url type owner",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
      ],
    })
    .populate({
      path: "favorite",
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
          select: "owner description likes mediaFiles createdAt updatedAt",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
        {
          path: "mediaFiles",
          select: "url type owner",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
      ],
    })
    .populate({
      path: "subscription",
      select:
        "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
      populate: [
        {
          path: "posts",
          select: "description createdAt updatedAt",
          populate: [
            {
              path: "comments",
              select: "owner description likes mediaFiles createdAt updatedAt",
              populate: { path: "owner", select: "_id surname name avatarURL" },
            },
            { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
            {
              path: "mediaFiles",
              select: "url type owner",
              populate: { path: "owner", select: "_id surname name avatarURL" },
            },
          ],
        },
        {
          path: "favorite",
          select: "description createdAt updatedAt",
          populate: [
            {
              path: "comments",
              select: "owner description likes mediaFiles createdAt updatedAt",
              populate: { path: "owner", select: "_id surname name avatarURL" },
            },
            { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
            {
              path: "mediaFiles",
              select: "url type owner",
              populate: { path: "owner", select: "_id surname name avatarURL" },
            },
          ],
        },
        {
          path: "subscription",
          select:
            "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
        },
      ],
    });

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
    status: "success",
    message: "We successfully found the user",
    data: { user: userTransformer(user), posts: posts.map((post) => postTransformer(post)) },
  });
};

module.exports = getUserById;
