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
          select: "url type owner location createdAt updatedAt",
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
          select: "url type owner location createdAt updatedAt",
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
              select: "url type owner location createdAt updatedAt",
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
              select: "url type owner location createdAt updatedAt",
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
