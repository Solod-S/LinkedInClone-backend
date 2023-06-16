const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { skillTransformer } = require("../../helpers/index");

const userRemove = async (req, res, next) => {
  const { _id } = req.user;
  const { skillId } = req.params;

  const skill = await Skill.findById({ _id: skillId });

  if (!skill || !skill.users.includes(_id)) {
    throw HttpError(404, "Not found");
  }

  skill.users.pull(_id);
  await skill.save();

  res.status(201).json({
    status: "success",
    message: "User was successfully removed from this skill",
    data: {
      skill: skillTransformer(skill),
    },
  });
};

module.exports = userRemove;
