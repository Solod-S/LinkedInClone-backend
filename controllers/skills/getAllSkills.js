const { Skill } = require("../../models");

const { transformers } = require("../../helpers/index");

const getAllSkills = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Skill.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Skill.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get all skills",
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
    message: "Successfully get all skills",
    data: {
      skills: skills.map((skill) => transformers.skillTransformer(skill)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllSkills;
