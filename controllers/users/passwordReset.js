const { User } = require("../../models");
const bcrypt = require("bcrypt");

const { userTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordReset = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: resetToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.resetToken = null;
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been successfully changed",
    data: { user: userTransformer(user) },
  });
};

module.exports = passwordReset;
