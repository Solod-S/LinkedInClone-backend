const { User, Token } = require("../../models");

const logout = async (req, res) => {
  const { token, _id } = req.token;

  await User.updateOne({ token: { $elemMatch: { $eq: _id } } }, { $pull: { token: _id } });
  await Token.findOneAndDelete({ token });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

module.exports = logout;
