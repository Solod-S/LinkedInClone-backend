const { User, Token } = require("../models/");

const jwt = require("jsonwebtoken");

const { HttpError } = require("../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id)
      .populate({
        path: "posts",
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
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
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
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
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "likes",
                select: "owner type",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
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
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "likes",
                select: "owner type",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
            ],
          },
          {
            path: "subscription",
            options: { limit: 10, sort: { createdAt: -1 } },
            select:
              "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
          },
        ],
      })
      .populate({
        path: "avatarURL",
        select: "url",
      });

    const tokenData = await Token.findOne({ token });

    if (!user || !tokenData || !user.token.includes(tokenData._id)) {
      next(HttpError(401, "Unauthorized"));
    }

    req.user = user;
    req.token = { token, _id: tokenData.id };
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
