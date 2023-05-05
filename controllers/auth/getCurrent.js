const { userTransformer } = require("../../helpers/index");

const getCurrent = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: "succes",
    data: { currentUser: userTransformer(user), token: user.token },
  });
};

module.exports = getCurrent;
