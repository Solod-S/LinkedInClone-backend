const { Job, Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { jobTransformer } = require("../../helpers/index");

const updateOwnJob = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { jobId } = req.params;

  const company = await Company.findOne({ owners: _id });
  const job = await Job.findById({ _id: jobId });

  if (!job || !company) {
    throw HttpError(404, "Not found");
  }

  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true, // return updated job
  })
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

  if (!updatedJob) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated the job",
    data: { job: jobTransformer(updatedJob) },
  });
};

module.exports = updateOwnJob;
