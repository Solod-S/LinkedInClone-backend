const { User } = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../../routes/errors/HttpErrors");

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email wrong or invalid");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(404, "Password wrong or invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "700h" });
  await User.findByIdAndUpdate(user._id, { token });

  const currentUser = await User.findOne({ token });
  res.status(200).json({
    status: "succes",
    data: { currentUser, token },
  });
};

module.exports = login;
