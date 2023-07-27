const { Education } = require("../../models");

const { transformers } = require("../../helpers/index");

const getOwnEducations = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Education.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Education.find({ owner: _id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get educations",
      data: {
        educations: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownExperiences = await Education.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location educationId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  res.json({
    status: "success",
    message: "Successfully get educations",
    data: {
      educations: ownExperiences.map((education) => transformers.educationTransformer(education)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnEducations;
