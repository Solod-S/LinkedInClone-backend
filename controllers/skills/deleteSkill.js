const { Skill, Education, Experience } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const deleteSkill = async (req, res, next) => {
  const { skillId } = req.params;

  const skill = await Skill.findById({ _id: skillId });

  if (!skill) {
    throw HttpError(404, "Not found");
  }

  await Education.updateMany({ skills: { $elemMatch: { $eq: skillId } } }, { $pull: { skills: skillId } });
  await Experience.updateMany({ skills: { $elemMatch: { $eq: skillId } } }, { $pull: { skills: skillId } });

  const result = await Skill.findByIdAndDelete({ _id: skillId });

  res.json({
    status: "success",
    message: "Skill successfully deleted",
    data: { skill: transformers.skillTransformer(result) },
  });
};

module.exports = deleteSkill;
