const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { skillTransformer } = require("../../helpers/index");

const deleteSkill = async (req, res, next) => {
  const { skillId } = req.params;

  const skill = await Skill.findById({ _id: skillId });

  if (!skill) {
    throw HttpError(404, "Not found");
  }

  const result = await Skill.findByIdAndDelete({ _id: skillId });

  res.json({ status: "success", message: "Skill successfully deleted", data: { skill: skillTransformer(result) } });
};

module.exports = deleteSkill;
