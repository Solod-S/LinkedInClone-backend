const { User, AccessToken, RefreshToken } = require("../../models");

const userLogout = async (req, res) => {
  const { token, _id } = req.accessToken;

  await User.updateOne({ accessTokens: { $elemMatch: { $eq: _id } } }, { $pull: { accessTokens: _id } });
  const accessToken = await AccessToken.findOneAndDelete({ token });

  const refreshToken = await RefreshToken.findOneAndDelete({ sessionId: accessToken.sessionId });
  await User.updateOne(
    { refreshTokens: { $elemMatch: { $eq: refreshToken._id } } },
    { $pull: { refreshTokens: refreshToken._id } }
  );
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

module.exports = userLogout;
