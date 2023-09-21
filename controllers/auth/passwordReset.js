const { User, AccessToken, RefreshToken } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const { transformers } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const { ACCES_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

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

  const payload = {
    id: user._id,
  };
  const sessionId = uuid.v4();

  const accessToken = jwt.sign(payload, ACCES_SECRET_KEY, { expiresIn: "2h" });

  const newAccesshToken = await AccessToken.create({ owner: user._id, token: accessToken, sessionId });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const newRefreshToken = await RefreshToken.create({ owner: user._id, token: refreshToken, sessionId });

  await User.findByIdAndUpdate(user._id, { $push: { accessTokens: newAccesshToken._id } }, { new: true });
  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: newRefreshToken._id } }, { new: true });

  res.status(200).json({
    status: "success",
    message: "Password has been successfully changed",
    data: { user: transformers.userTransformer(user), accessToken: accessToken, refreshToken: refreshToken, sessionId },
  });
};

module.exports = passwordReset;
