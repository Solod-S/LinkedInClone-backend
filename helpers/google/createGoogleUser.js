const { User, Token, MediaFile } = require("../../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;
// eslint-disable-next-line camelcase
const createGoogleUser = async ({ email, id, name, family_name, picture }) => {
  const hashPassword = await bcrypt.hash(id, 10);
  try {
    const createdUser = await User.create({
      email: email,
      name: name,
      // eslint-disable-next-line camelcase
      surname: family_name || name,
      verify: true,
      password: hashPassword,
    });

    if (picture) {
      const newMediaFile = await MediaFile.create({
        type: "img",
        userId: createdUser.id,
        location: "users",
        url: picture,
        providerPublicId: "google",
        owner: createdUser._id,
      });
      createdUser.avatarURL = newMediaFile._id;
      await createdUser.save();
    }

    const user = await User.findOne({ email });

    const payload = {
      id: user._id,
    };
    console.log(`payload`, payload);
    const token = jwt.sign(payload, SECRET_KEY);
    console.log(`token11`);
    const newToken = await Token.create({ owner: user._id, token });
    user.token.push(newToken._id); // Добавляем новый токен к пользователю
    await user.save(); // Сохраняем обновленную информацию о пользователе

    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createGoogleUser;
