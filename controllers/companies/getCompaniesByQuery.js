const { Skill, Company } = require("../../models");

const { companyTransformer } = require("../../helpers/index");

const getCompaniesByQuery = async (req, res, next) => {
  const { search = "" } = req.query;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const trimmedKeyword = search.trim();
  const skip = (page - 1) * perPage;

  const query = { name: { $regex: trimmedKeyword, $options: "i" } };
  const count = await Company.countDocuments(query);
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if (!search || (await Company.find(query)).length <= 0 || (await Skill.find()).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully found such companies",
      data: {
        skills: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const companies = await Company.find(query)
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .select("-users");

  res.status(200).json({
    status: "success",
    message: "Successfully found such companies",
    data: {
      companies: companies.map((company) => companyTransformer(company)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getCompaniesByQuery;
