const { User } = require("../../models");

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

module.exports = logout;
