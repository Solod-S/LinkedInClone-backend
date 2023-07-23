const { Job } = require("../../models");

const { jobTransformer } = require("../../helpers/index");

const getJobsByQuery = async (req, res, next) => {
  const { search = "" } = req.query;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const trimmedKeyword = search.trim();

  const query = {
    $or: [
      { title: { $regex: trimmedKeyword, $options: "i" } },
      { description: { $regex: trimmedKeyword, $options: "i" } },
    ],
  };
  const count = await Job.countDocuments(query);
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if (!search || (await Job.find(query)).length <= 0 || (await Job.find()).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully found such jobs",
      data: {
        jobs: [],
        totalPages: 0,
        currentPage: page,
        perPage,
      },
    });
  }

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    // .populate({
    //   path: "applied",
    //   select:
    //     "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
    // })
    .populate({
      path: "skills",
      select: "_id skill",
    })
    .populate({
      path: "owner",
      select:
        "_id name description industry location website email phone foundedYear employeesCount avatarURL createdAt updatedAt",
      populate: {
        path: "avatarURL",
        select: "url",
      },
    });

  res.status(200).json({
    status: "success",
    message: "Successfully found such jobs",
    data: {
      jobs: jobs.map((publication) => jobTransformer(publication)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getJobsByQuery;
