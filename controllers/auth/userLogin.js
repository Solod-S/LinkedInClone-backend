const { User, AccessToken } = require("../../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const { transformers } = require("../../helpers/index");

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email wrong or invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(404, "Password wrong or invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  // const token = jwt.sign(payload, SECRET_KEY);
  const newToken = await AccessToken.create({ owner: user._id, token });
  await User.findByIdAndUpdate(user._id, { $push: { accessTokens: newToken._id } }, { new: true });

  const currentUser = await User.findOne({ accessTokens: { $in: [newToken._id] } })
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
    message: "Successful login",
    data: { user: transformers.userTransformer(currentUser), accessToken: token },
  });
};

module.exports = userLogin;
