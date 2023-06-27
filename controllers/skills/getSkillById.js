const { Skill } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { skillTransformer } = require("../../helpers/index");

const getSkillById = async (req, res, next) => {
  const { skillId } = req.params;
  const { page, perPage } = req.query;

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(perPage) || 10;

  const skill = await Skill.findById({ _id: skillId })
    .populate({
      path: "users",
      select:
        "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      options: {
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      },
    })
    .lean();

  if (!skill) {
    return next(HttpError(404, "Not found"));
  }
  const skillCounter = await Skill.findById({ _id: skillId });
  const totalUsers = skillCounter.users.length;

  const totalPages = Math.ceil(totalUsers / pageSize);
  const currentPage = pageNumber;


  res.status(200).json({
    status: "success",
    message: "We successfully found the skill",
    data: {
      skill: skillTransformer(skill),
      users: skill.users,
      totalPages,
      currentPage,
      perPage: pageSize,
    },
  });
};

module.exports = getSkillById;
