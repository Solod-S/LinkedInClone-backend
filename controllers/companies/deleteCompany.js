const { Company, Job, Publication } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const deleteCompany = async (req, res, next) => {
  const { _id } = req.user;
  const { companyId } = req.params;

  const company = await Company.findById({ _id: companyId });

  if (!company || !company.owners.includes(_id)) {
    throw HttpError(404, "Not found");
  }

  const result = await Company.findByIdAndDelete({ _id: companyId }).populate({
    path: "avatarURL",
    select: "url",
  });
  await Publication.deleteMany({ owner: result._id });
  await Job.deleteMany({ owner: result._id });

  res.json({
    status: "success",
    message: "Company successfully deleted",
    data: { company: transformers.companyTransformer(result) },
  });
};

module.exports = deleteCompany;
