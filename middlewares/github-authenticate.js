const { User, MediaFile } = require("../models");

const gitPassport = require("passport");
const { Strategy } = require("passport-github2");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BASE_HTTPS_URL } = process.env;

const githubParams = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_HTTPS_URL}/auth/github-redirect`,
};

const facebookCallback = async (req, accesssToken, refreshToken, profile, done) => {
  try {
    const { email, login, id } = profile._json;
    const githubEmail = email || `github${id}@github.com`;
    const picture = profile._json.avatar_url;
    const user = await User.findOne({ email: githubEmail });

    if (user) {
      const currentUser = await User.findOne({ email: githubEmail })
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
      return done(null, currentUser);
      // передает работу дальше и закрепляет в req.user = user
    }
    const code = uuid.v4();
    const password = await bcrypt.hash(code, 10);
    const newUser = await User.create({
      email: githubEmail,
      password,
      name: login,
      surname: login,
      verify: true,
    });

    if (picture) {
      const newMediaFile = await MediaFile.create({
        type: "img",
        userId: newUser.id,
        location: "users",
        url: picture,
        providerPublicId: "github",
        owner: newUser._id,
      });
      newUser.avatarURL = newMediaFile._id;
      await newUser.save();
    }

    return done(null, newUser);
    // передает работу дальше и закрепляет в req.user = newUser
  } catch (error) {
    done(error, false);
    // перекидывает на обработчик ошибок
  }
};

const githubStrategy = new Strategy(githubParams, facebookCallback);
gitPassport.use("github", githubStrategy);

module.exports = gitPassport;
