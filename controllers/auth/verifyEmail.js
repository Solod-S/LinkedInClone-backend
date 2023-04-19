const { User } = require("../../models/users");
// const createError = require("http-errors");

const { HttpError } = require("../../routes/errors/HttpErrors");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken: verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  console.log(user);
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({
    status: "succes",
    code: 200,
    message: "Verification successful",
  });
};

module.exports = verifyEmail;
