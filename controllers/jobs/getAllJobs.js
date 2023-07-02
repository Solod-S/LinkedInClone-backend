const { Job } = require("../../models");

const { jobTransformer } = require("../../helpers/index");

const getAllJobs = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Job.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Job.find({})).length <= 0) {
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

  const jobs = await Job.find({})
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
    })
    .populate({
      path: "owner",
      select:
        "_id name description industry location website email phone foundedYear employeesCount avatarURL createdAt updatedAt",
    });

  res.json({
    status: "success",
    message: "Successfully get jobs",
    data: {
      jobs: jobs.map((job) => jobTransformer(job)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllJobs;
