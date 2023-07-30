const { User, AccessToken, MediaFile, Job, Skill, Company } = require("../../models");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const deleteUser = async (token) => {
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    await User.findOneAndDelete({ _id: id });

    await AccessToken.deleteMany({ owner: id });
    await MediaFile.deleteOne({ location: "users", owner: id });
    await Job.updateMany({ applied: { $elemMatch: { $eq: id } } }, { $pull: { applied: id } });
    await Skill.updateMany({ users: { $elemMatch: { $eq: id } } }, { $pull: { users: id } });
    await Company.updateMany({ workers: { $elemMatch: { $eq: id } } }, { $pull: { workers: id } });
    await Company.updateMany({ owners: { $elemMatch: { $eq: id } } }, { $pull: { owners: id } });
    await User.updateMany({ subscription: { $elemMatch: { $eq: id } } }, { $pull: { subscription: id } });
  } catch (error) {
    console.log(error);
  }
};

module.exports = deleteUser;
