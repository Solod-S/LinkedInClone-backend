const { User, MediaFile } = require("../models");

const gPassport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_HTTPS_URL } = process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_HTTPS_URL}/auth/google-redirect`,
  passReqToCallback: true,
};

const gooogleCallback = async (req, accesssToken, refreshToken, profile, done) => {
  try {
    // eslint-disable-next-line camelcase
    const { email, given_name, family_name, picture } = profile;
    const user = await User.findOne({ email });
    if (user) {
      const currentUser = await User.findOne({ email })
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
      email,
      password,
      name: given_name,
      surname: family_name,
      verify: true,
    });

    if (picture) {
      const newMediaFile = await MediaFile.create({
        type: "img",
        userId: newUser.id,
        location: "users",
        url: picture,
        providerPublicId: "google",
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

const googleStrategy = new Strategy(googleParams, gooogleCallback);
gPassport.use("google", googleStrategy);

module.exports = gPassport;
