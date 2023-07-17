const { User } = require("../../models");
const bcrypt = require("bcrypt");

const { userTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordReset = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: resetToken })
    .populate({
      path: "posts",
      options: { limit: 10, sort: { createdAt: -1 } },
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
          options: { limit: 10, sort: { createdAt: -1 } },
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
      options: { limit: 10, sort: { createdAt: -1 } },
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
          options: { limit: 10, sort: { createdAt: -1 } },
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
      options: { limit: 10, sort: { createdAt: -1 } },
      select:
        "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
      populate: [
        {
          path: "posts",
          options: { limit: 10, sort: { createdAt: -1 } },
          select: "description createdAt updatedAt",
          populate: [
            {
              path: "comments",
              options: { limit: 10, sort: { createdAt: -1 } },
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
          options: { limit: 10, sort: { createdAt: -1 } },
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
          options: { limit: 10, sort: { createdAt: -1 } },
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
    throw HttpError(404, "User not found");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.resetToken = null;
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been successfully changed",
    data: { user: userTransformer(user) },
  });
};

module.exports = passwordReset;
