const { User } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode: verificationCode });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.verify = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Verification successful",
  });
};

module.exports = verifyEmail;
