const { Company, Job } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { jobTransformer } = require("../../helpers/index");

const deleteOwnJob = async (req, res, next) => {
  const { _id } = req.user;
  const { jobId } = req.params;

  const job = await Job.findById({ _id: jobId });
  const company = await Company.findOne({ owners: _id });

  if (!job || !company) {
    throw HttpError(404, "Not found");
  }

  const result = await Job.findByIdAndDelete({ _id: jobId })
    .populate({
      path: "applied",
      select:
        "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
    })
    .populate({
      path: "skills",
      select: "_id skill",
    }).populate({
      path: "owner",
      select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
    });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await Company.updateOne({ jobs: { $elemMatch: { $eq: job._id } } }, { $pull: { jobs: job._id } });

  res.json({
    status: "success",
    message: "Job successfully deleted",
    data: { job: jobTransformer(result) },
  });
};

module.exports = deleteOwnJob;
