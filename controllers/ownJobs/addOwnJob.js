const { Company, Job } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const addOwnJobs = async (req, res, next) => {
  const { _id } = req.user;

  const company = await Company.findOne({ owners: _id });

  if (!company) {
    throw HttpError(404, "Not found");
  }

  const newJob = await Job.create({
    ...req.body,
    owner: company._id,
  });

  company.jobs.push(newJob._id);
  await company.save();

  const job = await Job.findById({ _id: newJob._id })
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
  res.status(201).json({
    status: "success",
    message: "Job successfully created",
    data: { job: transformers.jobTransformer(job) },
  });
};

module.exports = addOwnJobs;
