const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById({ _id: userId })
    .populate({
      path: "posts",
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
          select: "owner description likes mediaFiles createdAt updatedAt",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
        {
          path: "likes",
          select: "owner type",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
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
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
        {
          path: "likes",
          select: "owner type",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
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
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
            },
            {
              path: "likes",
              select: "owner type",
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
            },
            {
              path: "mediaFiles",
              select: "url type owner location createdAt updatedAt",
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
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
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
            },
            {
              path: "likes",
              select: "owner type",
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
            },
            {
              path: "mediaFiles",
              select: "url type owner location createdAt updatedAt",
              populate: {
                path: "owner",
                select: "_id surname name avatarURL",
                populate: { path: "avatarURL", select: "url" },
              },
            },
          ],
        },
        {
          path: "subscription",
          select:
            "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
          populate: { path: "avatarURL", select: "url" },
        },
        {
          path: "avatarURL",
          select: "url",
        },
      ],
    })
    .populate({
      path: "avatarURL",
      select: "url",
    });

  if (!user) {
    throw HttpError(404, "Not found");
  }

  const posts = await Post.find({ owner: userId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location createdAt updatedAt",
      populate: { path: "owner", select: "_id surname name avatarURL", populate: { path: "avatarURL", select: "url" } },
    })
    .populate({
      path: "likes",
      select: "owner type",
      populate: { path: "owner", select: "_id surname name avatarURL", populate: { path: "avatarURL", select: "url" } },
    })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id surname name avatarURL", populate: { path: "avatarURL", select: "url" } },
        {
          path: "likes",
          select: "owner type",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select: "_id surname name avatarURL",
            populate: { path: "avatarURL", select: "url" },
          },
        },
      ],
    });

  res.status(200).json({
    status: "success",
    message: "Successfully found the user",
    data: { user: transformers.userTransformer(user), posts: posts.map((post) => transformers.postTransformer(post)) },
  });
};

module.exports = getUserById;
