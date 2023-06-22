const { Experience } = require("../../models");

const { experienceTransformer } = require("../../helpers/index");

const getOwnExperiences = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await Experience.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Experience.find({ owner: _id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get experiences",
      data: {
        experiences: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownExperiences = await Experience.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location experienceId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  res.json({
    status: "success",
    message: "Successfully get experiences",
    data: {
      experiences: ownExperiences.map((experience) => experienceTransformer(experience)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnExperiences;
