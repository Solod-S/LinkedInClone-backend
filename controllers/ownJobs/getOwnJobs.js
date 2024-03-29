const { Job, Company } = require("../../models");

const { transformers } = require("../../helpers/index");

const getOwnJobs = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const company = await Company.findOne({ owners: _id });

  if (!company) {
    return res.json({
      status: "success",
      message: "Successfully get jobs",
      data: {
        jobs: [],
        totalPages: 0,
        currentPage: page,
        perPage,
      },
    });
  }

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
      populate: {
        path: "avatarURL",
        select: "url",
      },
    })
    .populate({
      path: "skills",
      select: "_id skill",
    })
    .populate({
      path: "owner",
      select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
      populate: {
        path: "avatarURL",
        select: "url",
      },
    });

  res.json({
    status: "success",
    message: "Successfully get jobs",
    data: {
      jobs: ownJobs.map((job) => transformers.jobTransformer(job)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnJobs;
