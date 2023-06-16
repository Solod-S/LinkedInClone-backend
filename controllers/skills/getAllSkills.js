const { Skill } = require("../../models");

const { skillTransformer } = require("../../helpers/index");

const getAllSkills = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await Skill.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Skill.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get skills",
      data: {
        skills: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const skills = await Skill.find({})
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .select("-users");

  res.json({
    status: "success",
    message: "Successfully get skills",
    data: {
      skills: skills.map((skill) => skillTransformer(skill)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllSkills;
