const { User } = require("../models");

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
            select: "description createdAt updatedAt",
            populate: [
              {
                path: "comments",
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
            select:
              "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
          },
        ],
      });
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Unauthorized"));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
