const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateSkill = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { skillId } = req.params;

  const skill = await Skill.findById({ _id: skillId });

  if (!skill) {
    throw HttpError(404, "Not found");
  }

  const updatedskill = await Skill.findByIdAndUpdate(skillId, updateData, {
    new: true, // return updated skill
  });

  if (!updatedskill) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated skill",
    data: { skill: transformers.skillTransformer(updatedskill) },
  });
};

module.exports = updateSkill;
