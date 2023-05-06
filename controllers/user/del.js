const { User } = require("../../models/");

const { userTransformer } = require("../../helpers/index");

const del = async (req, res) => {
  const { _id } = req.user;

  const deletedUser = await User.findOneAndDelete({ _id });

  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ status: "success", data: { deletedUser: userTransformer(deletedUser) } });
};

module.exports = del;
