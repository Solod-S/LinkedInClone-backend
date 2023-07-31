const { User, AccessToken } = require("../../models");

const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const { ACCES_SECRET_KEY } = process.env;

const createUserToken = async (email, password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = uuid.v4();

    await User.create({
      email,
      name: "Sergey",
      surname: "Sergeyovich",
      verify: true,
      password: hashPassword,
      verificationCode,
    });
    const user = await User.findOne({ email });
    await bcrypt.compare(password, user.password);

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, ACCES_SECRET_KEY);
    const newToken = await AccessToken.create({ owner: user._id, token });
    user.accessTokens.push(newToken._id); // Добавляем новый токен к пользователю
    await user.save(); // Сохраняем обновленную информацию о пользователе

    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createUserToken;
