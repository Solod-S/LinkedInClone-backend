const { Job, Company } = require("../../models");

const { jobTransformer } = require("../../helpers/index");

const getOwnJobs = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const company = await Company.findOne({ owners: _id });
  const count = await Job.countDocuments({ owner: company._id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Job.find({ owner: company._id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get jobs",
      data: {
        jobs: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownJobs = await Job.find({ owner: company._id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "applied",
      select:
        "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
    })
    .populate({
      path: "skills",
      select: "_id skill",
    });

  res.json({
    status: "success",
    message: "Successfully get jobs",
    data: {
      jobs: ownJobs.map((job) => jobTransformer(job)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnJobs;
