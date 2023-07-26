const { User } = require("../../models");

const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { HttpError } = require("../../routes/errors/HttpErrors");

const devRegister = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "This email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = uuid.v4();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationCode,
  });

  res.status(201).json({
    status: "success",
    message: "User successfully registered",
    data: { email: newUser.email, name: newUser.name },
  });
};

module.exports = devRegister;
