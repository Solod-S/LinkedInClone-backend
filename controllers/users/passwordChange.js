const { User } = require("../../models");
const bcrypt = require("bcrypt");

const { userTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordChange = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id, password } = req.user;

  const isOldPasswordValid = await bcrypt.compare(oldPassword, password);

  if (!isOldPasswordValid) {
    throw HttpError(403, "Old password is incorrect");
  }

  const newBcryptedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findByIdAndUpdate(_id, { password: newBcryptedPassword })
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
    })
    .populate({
      path: "avatarURL",
      select: "url",
    });

  res.json({
    status: "success",
    message: "Password has been successfully changed",
    data: { user: userTransformer(user) },
  });
};

module.exports = passwordChange;
