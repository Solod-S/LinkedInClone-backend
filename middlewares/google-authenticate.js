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
    const { email, displayName, family_name, picture } = profile;

    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
      // передает работу дальше и закрепляет в req.user = user
    }
    const code = uuid.v4();
    const password = await bcrypt.hash(code, 10);
    const newUser = await User.create({
      email,
      password,
      name: displayName,
      surname: family_name || displayName,
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
