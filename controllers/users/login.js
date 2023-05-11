const { User } = require("../../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const { userTransformer } = require("../../helpers/index");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email wrong or invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(404, "Password wrong or invalid");
  }

  const payload = {
    id: user._id,
  };

  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "700h" });
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });

  const currentUser = await User.findOne({ token });

  res.status(200).json({
    status: "succes",
    data: { currentUser: userTransformer(currentUser), token },
  });
};

module.exports = login;
