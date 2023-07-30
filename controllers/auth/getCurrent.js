const { transformers } = require("../../helpers/index");

const getCurrent = async (req, res) => {
  const user = req.user;
  const { token } = req.accessToken;

  res.status(200).json({
    status: "success",
    message: "Successfully collected the current data",
    data: { user: transformers.userTransformer(user), accessToken: token },
  });
};

module.exports = getCurrent;
