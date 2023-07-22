const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { skillTransformer } = require("../../helpers/index");

const userAdd = async (req, res, next) => {
  const { _id } = req.user;
  const { skillId } = req.params;

  const skill = await Skill.findById({ _id: skillId });

  if (!skill) {
    throw HttpError(404, "Not found");
  }

  if (skill.users.includes(_id)) {
    throw HttpError(409, `Sorry, the user was added to this skill before`);
  }

  skill.users.push(_id);
  await skill.save();

  res.status(200).json({
    status: "success",
    message: "User was successfully added to this skill",
    data: {
      skill: skillTransformer(skill),
    },
  });
};

module.exports = userAdd;
