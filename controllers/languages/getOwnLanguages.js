const { Language } = require("../../models");

const { languageTransformer } = require("../../helpers/index");

const getOwnLanguages = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await Language.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Language.find({ owner: _id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get languages",
      data: {
        languages: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownExperiences = await Language.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage);

  res.json({
    status: "success",
    message: "Successfully get languages",
    data: {
      languages: ownExperiences.map((education) => languageTransformer(education)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnLanguages;
