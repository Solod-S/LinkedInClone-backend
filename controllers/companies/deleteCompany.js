const { Company, Job } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const deleteCompany = async (req, res, next) => {
  const { companyId } = req.params;

  const skill = await Company.findById({ _id: companyId });

  if (!skill) {
    throw HttpError(404, "Not found");
  }

  const result = await Company.findByIdAndDelete({ _id: companyId });
  // await Job.deleteMany({ owner: result._id });

  res.json({
    status: "success",
    message: "Company successfully deleted",
    data: { Company: companyTransformer(result) },
  });
};

module.exports = deleteCompany;
