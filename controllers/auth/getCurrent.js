const { transformers } = require("../../helpers/index");

const getCurrent = async (req, res) => {
  const user = req.user;
  const { token } = req.token;

  res.status(200).json({
    status: "success",
    message: "Successfully collected the current data",
    data: { user: transformers.userTransformer(user), token: token },
  });
};

module.exports = getCurrent;
