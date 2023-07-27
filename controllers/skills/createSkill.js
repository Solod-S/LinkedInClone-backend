const { Skill } = require("../../models");

const { transformers } = require("../../helpers/index");

const createSkill = async (req, res, next) => {
  const { _id } = req.user;
  const { skill } = req.body;

  // Установка первой буквы в верхний регистр
  const formattedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);

  const existingSkill = await Skill.findOne({ skill: { $regex: new RegExp(`^${skill}$`, "i") } });

  if (existingSkill) {
    if (!existingSkill.users.includes(_id)) {
      existingSkill.users.push(_id);
      await existingSkill.save();
    }
    return res.status(200).json({
      status: "success",
      message: `The skill "${existingSkill.skill}" was created before`,
      data: { skill: transformers.skillTransformer(existingSkill) },
    });
  }

  const newSkill = await Skill.create({
    skill: formattedSkill,
    users: [_id],
  });

  res
    .status(201)
    .json({
      status: "success",
      message: "Skill successfully created",
      data: { skill: transformers.skillTransformer(newSkill) },
    });
};

module.exports = createSkill;
