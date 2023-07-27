const { Skill } = require("../../models");

const { transformers } = require("../../helpers/index");

const getSkillByQuery = async (req, res, next) => {
  const { search = "" } = req.query;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const trimmedKeyword = search.trim();

  const query = { skill: { $regex: trimmedKeyword, $options: "i" } };
  const count = await Skill.countDocuments(query);
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if (!search || (await Skill.find(query)).length <= 0 || (await Skill.find()).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully found such skills",
      data: {
        skills: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const skills = await Skill.find(query)
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .select("-users");

  res.status(200).json({
    status: "success",
    message: "Successfully found such skills",
    data: {
      skills: skills.map((skill) => transformers.skillTransformer(skill)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getSkillByQuery;
