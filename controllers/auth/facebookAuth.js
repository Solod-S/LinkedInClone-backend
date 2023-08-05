const { User, AccessToken, RefreshToken } = require("../../models");

const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const { ACCES_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const { transformers } = require("../../helpers/index");

const facebookAuth = async (req, res) => {
  const { user } = req;

  const payload = {
    id: user._id,
  };

  const sessionId = uuid.v4();

  const accessToken = jwt.sign(payload, ACCES_SECRET_KEY, { expiresIn: "2h" });
  const newAccesshToken = await AccessToken.create({ owner: user._id, token: accessToken, sessionId });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const newRefreshToken = await RefreshToken.create({ owner: user._id, token: refreshToken, sessionId });
  await User.findByIdAndUpdate(user._id, { $push: { accessTokens: newAccesshToken._id } }, { new: true });
  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: newRefreshToken._id } }, { new: true });

  res.status(200).json({
    status: "success",
    message: "Successful login",
    data: {
      user: transformers.userTransformer(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionId,
    },
  });
};

module.exports = facebookAuth;
