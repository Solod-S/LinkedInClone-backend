const { User, Token } = require("../models");

const jwt = require("jsonwebtoken");

const { ADMINS } = process.env;

const { HttpError } = require("../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const isAdminMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  // try {
  //   const { id } = jwt.verify(token, SECRET_KEY);
  //   const user = await User.findById(id);
  //   const mayPass = ADMINS.includes(user.email);

  //   if (!user || !user.token || user.token !== token || !mayPass) {
  //     next(HttpError(403, "Access denied. Admin rights required"));
  //   }
  //   req.user = user;
  //   next();
  // } catch {
  //   next(HttpError(401));
  // }
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

    const tokenData = await Token.findOne({ token });
    const mayPass = ADMINS.includes(user.email);

    if (!user || !tokenData || !user.token.includes(tokenData._id) || !mayPass) {
      next(HttpError(401, "Unauthorized"));
    }

    req.user = user;
    req.token = { token, _id: tokenData.id };
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = isAdminMiddleware;
