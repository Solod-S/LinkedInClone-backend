const { User } = require("../../models/users");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { sendEmail } = require("../../helpers");
const { createVerifyEmail } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }

  // const verifyEmail = createVerifyEmail(email, user.verificationCode);
  // await sendEmail(verifyEmail);
  res.status(201).json({
    status: "success",
    code: 201,
  });
};

module.exports = resendVerifyEmail;
