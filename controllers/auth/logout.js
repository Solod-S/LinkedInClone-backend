const { User } = require("../../models/users");

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(200).json({
    status: "succes",
    message: "Logout successful",
  });
};

module.exports = logout;
