const { User } = require("../../models");
const bcrypt = require("bcrypt");

const { userTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordChange = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id, password } = req.user;

  const isOldPasswordValid = await bcrypt.compare(oldPassword, password);

  if (!isOldPasswordValid) {
    throw HttpError(404, "Old password is incorrect");
  }

  const newBcryptedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findByIdAndUpdate(_id, { password: newBcryptedPassword });

  res.json({
    status: "success",
    message: "Password has been successfully changed",
    data: { user: userTransformer(user) },
  });
};

module.exports = passwordChange;
