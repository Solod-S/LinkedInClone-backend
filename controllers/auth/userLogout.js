const { User, AccessToken } = require("../../models");

const userLogout = async (req, res) => {
  const { token, _id } = req.accessToken;

  await User.updateOne({ accessTokens: { $elemMatch: { $eq: _id } } }, { $pull: { accessTokens: _id } });
  await AccessToken.findOneAndDelete({ token });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

module.exports = userLogout;
