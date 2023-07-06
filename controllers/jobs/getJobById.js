const { Job } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { jobTransformer } = require("../../helpers/index");

const getJobById = async (req, res, next) => {
  const { jobId } = req.params;

  const job = await Job.findById({ _id: jobId })
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

  if (!job) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: "success",
    message: "Successfully found the job",
    data: { job: jobTransformer(job) },
  });
};

module.exports = getJobById;
