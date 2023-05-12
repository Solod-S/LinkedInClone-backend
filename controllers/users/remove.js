const { User } = require("../../models");

const { userTransformer } = require("../../helpers/index");

const remove = async (req, res) => {
  const { _id } = req.user;

  const deletedUser = await User.findOneAndDelete({ _id });

  res.status(200).json({ status: "success", data: { user: userTransformer(deletedUser) } });
};

module.exports = remove;
