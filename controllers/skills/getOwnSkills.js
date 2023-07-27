const { Skill } = require("../../models");

const { transformers } = require("../../helpers/index");

const getOwnSkills = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  console.log(_id);

  const count = await Skill.countDocuments({ users: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Skill.find({ users: _id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get own skills",
      data: {
        skills: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const skills = await Skill.find({ users: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .select("-users");

  res.json({
    status: "success",
    message: "Successfully get own skills",
    data: {
      skills: skills.map((skill) => transformers.skillTransformer(skill)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnSkills;
