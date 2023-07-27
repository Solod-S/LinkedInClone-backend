const { User } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { emailUtils } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }

  const verifyEmail = emailUtils.createVerifyEmail(email, user.verificationCode);
  await emailUtils.sendEmail(verifyEmail);

  res.status(201).json({
    status: "success",
    message: "Sending email verification was successful",
  });
};

module.exports = resendVerifyEmail;
