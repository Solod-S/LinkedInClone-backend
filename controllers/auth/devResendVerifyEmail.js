const { User } = require("../../models/users");

const { HttpError } = require("../../routes/errors/HttpErrors");

const devResendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }

  res.status(201).json({
    status: "success",
    code: 201,
  });
};

module.exports = devResendVerifyEmail;
