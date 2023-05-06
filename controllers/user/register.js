const { User } = require("../../models/");

const bcrypt = require("bcrypt");
const uuid = require("uuid");
const gravatar = require("gravatar");

const { sendEmail } = require("../../helpers");
const { createVerifyEmail } = require("../../helpers");
const { HttpError } = require("../../routes/errors/HttpErrors");

const register = async (rec, res) => {
  const { email, password } = rec.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "This email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = uuid.v4();
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...rec.body,
    password: hashPassword,
    verificationCode,
    avatarURL,
  });

  const verifyEmail = createVerifyEmail(email, verificationCode);
  await sendEmail(verifyEmail);

  res.status(201).json({
    status: "succes",
    data: { email: newUser.email, name: newUser.name },
  });
};

module.exports = register;