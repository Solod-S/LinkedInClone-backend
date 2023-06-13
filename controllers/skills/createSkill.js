const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");

const createSkill = async (req, res, next) => {
  const { _id } = req.user;
  const { skill } = req.body;

  // Установка первой буквы в верхний регистр
  const formattedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
  
  const skillsExist = await Skill.findOne({ skill: { $regex: new RegExp(`^${skill}$`, "i") } });

  if (skillsExist) {
    throw HttpError(409, `Sorry, the skill was created before`);
  } 

  const newSkill = await Skill.create({
    skill: formattedSkill,
    users: [_id] 
  });

  res
    .status(201)
    .json({ status: "success", message: "Skill successfully created", data: { newSkill } });
};

module.exports = createSkill;
