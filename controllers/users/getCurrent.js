const { userTransformer } = require("../../helpers/index");

const getCurrent = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    message: "Successfully collected the current data",
    data: { user: userTransformer(user), token: user.token },
  });
};

module.exports = getCurrent;
