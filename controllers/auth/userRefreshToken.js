const { User, AccessToken, RefreshToken } = require("../../models");

const jwt = require("jsonwebtoken");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { ACCES_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const { transformers } = require("../../helpers/index");

const userRefreshToken = async (req, res) => {
  const { refreshToken: token, sessionId } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);

    const oldRefreshToken = await RefreshToken.findOne({ sessionId });
    const oldAccessToken = await AccessToken.findOne({ sessionId });

    const isTokenExist = await RefreshToken.findOne({ token });

    if (!isTokenExist || !oldRefreshToken || !oldAccessToken) {
      await RefreshToken.findOneAndDelete({ sessionId });
      await AccessToken.findOneAndDelete({ sessionId });
      await User.updateOne(
        { refreshTokens: { $elemMatch: { $eq: oldRefreshToken._id } } },
        { $pull: { refreshTokens: oldRefreshToken._id } }
      );
      await User.updateOne(
        { accessTokens: { $elemMatch: { $eq: oldAccessToken._id } } },
        { $pull: { accessTokens: oldAccessToken._id } }
      );
      throw HttpError(403, "Token invalid");
    }
    const isUserExist = await User.findOne({ refreshTokens: { $in: [isTokenExist._id] } });

    if (!isUserExist) {
      await RefreshToken.findOneAndDelete({ sessionId });
      await AccessToken.findOneAndDelete({ sessionId });
      await User.updateOne(
        { refreshTokens: { $elemMatch: { $eq: oldRefreshToken._id } } },
        { $pull: { refreshTokens: oldRefreshToken._id } }
      );

      throw HttpError(403, "Token invalid");
    }

    const payload = {
      id,
    };

    await RefreshToken.findOneAndDelete({ sessionId });
    await AccessToken.findOneAndDelete({ sessionId });

    const accessToken = jwt.sign(payload, ACCES_SECRET_KEY, { expiresIn: "2h" });
    const newAccesshToken = await AccessToken.create({ owner: id, token: accessToken, sessionId });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
    const newRefreshToken = await RefreshToken.create({ owner: id, token: refreshToken, sessionId });

    await User.updateOne(
      { refreshTokens: { $elemMatch: { $eq: oldRefreshToken._id } } },
      { $pull: { refreshTokens: oldRefreshToken._id } }
    );
    await User.updateOne(
      { accessTokens: { $elemMatch: { $eq: oldAccessToken._id } } },
      { $pull: { accessTokens: oldAccessToken._id } }
    );

    await User.findByIdAndUpdate(id, { $push: { accessTokens: newAccesshToken._id } }, { new: true });
    await User.findByIdAndUpdate(id, { $push: { refreshTokens: newRefreshToken._id } }, { new: true });

    const currentUser = await User.findById(id)
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

    res.status(200).json({
      status: "success",
      message: "Token successfully refreshed",
      data: {
        user: transformers.userTransformer(currentUser),
        accessToken: accessToken,
        refreshToken: refreshToken,
        sessionId,
      },
    });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

module.exports = userRefreshToken;
