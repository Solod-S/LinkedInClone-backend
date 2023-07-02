const { Company } = require("../../models");

const { companyTransformer } = require("../../helpers/index");

const getAllCompanies = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Company.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Company.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get companies",
      data: {
        companies: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const companies = await Company.find({})
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .select("-publications -jobs -workers -owners");

  res.json({
    status: "success",
    message: "Successfully get companies",
    data: {
      companies: companies.map((company) => companyTransformer(company)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllCompanies;
