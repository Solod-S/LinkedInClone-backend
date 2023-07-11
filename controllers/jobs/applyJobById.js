const { Job } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { jobTransformer } = require("../../helpers/index");

const applyJobById = async (req, res, next) => {
  const { _id } = req.user;
  const { jobId } = req.params;

  const job = await Job.findById({ _id: jobId })
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

  if (job.applied.includes(_id)) {
    throw HttpError(409, `Sorry, the user was applyed to this job before`);
  }

  job.applied.push(_id);
  await job.save();
  // await job.populate({
  //   path: "applied",
  //   select:
  //     "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
  // });

  res.status(200).json({
    status: "success",
    message: "User successfully applyed to this job",
    data: { job: jobTransformer(job) },
  });
};

module.exports = applyJobById;
