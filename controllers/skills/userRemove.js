const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

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
      skill: {
        _id: skill._id,
        skill: skill.skill,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
      },
    },
  });
};

module.exports = userRemove;
