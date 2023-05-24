const { User } = require("../../models");

const bcrypt = require("bcrypt");

const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordChange = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id, password } = req.user;

  const oldBcryptedPassword = await bcrypt.hash(password, 10);

  console.log(`1`, oldBcryptedPassword, oldPassword);

  if (oldBcryptedPassword !== oldPassword) {
    throw HttpError(404, "Old password wrong or invalid");
  }

  const newBcryptedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(_id, { password: newBcryptedPassword });

  res.status(201).json({
    status: "succes",
    data: {},
  });
};

module.exports = passwordChange;
