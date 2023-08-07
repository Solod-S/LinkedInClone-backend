const { User, MediaFile } = require("../models");

const lPassport = require("passport");
const { Strategy } = require("passport-linkedin-oauth2");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, BASE_HTTPS_URL } = process.env;
const linkedinParams = {
  clientID: LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_CLIENT_SECRET,
  callbackURL: `${BASE_HTTPS_URL}/auth/linkedin-redirect`,
  profileFields: ["id", "displayName", "email"],
  passReqToCallback: true,
};

const linkedinCallback = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const { id } = profile;
    const linkedInEmail = profile.emails?.[0]?.value || `${id}@linkedin.com`;
    const existAvatart = profile.photos[2].value;

    const user = await User.findOne({ email: linkedInEmail });
    if (user) {
      const currentUser = await User.findOne({ email: linkedInEmail })
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
    }
    const code = uuid.v4();
    const password = await bcrypt.hash(code, 10);

    const newUser = await User.create({
      email: linkedInEmail,
      password,
      // name: firstName.localized.uk_UA,
      // surname: lastName.localized.uk_UA,
      name: profile.name.givenName,
      surname: profile.name.familyName,
      verify: true,
    });

    if (existAvatart) {
      const newMediaFile = await MediaFile.create({
        type: "img",
        userId: newUser.id,
        location: "users",
        url: existAvatart,
        providerPublicId: "linkedIn",
        owner: newUser._id,
      });
      newUser.avatarURL = newMediaFile._id;
      await newUser.save();
    }
    const currentUser = await User.findOne({ email: linkedInEmail })
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
  } catch (error) {
    done(error, false);
  }
};

const linkedinStrategy = new Strategy(linkedinParams, linkedinCallback);
lPassport.use("linkedin", linkedinStrategy);

module.exports = lPassport;
