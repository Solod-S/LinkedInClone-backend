const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const updateCompany = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { companyId } = req.params;

  const company = await Company.findById({ _id: companyId });

  if (!company) {
    throw HttpError(404, "Not found");
  }

  const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, {
    new: true, // return updated company
  });

  if (!updatedCompany) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated company",
    data: { company: companyTransformer(updatedCompany) },
  });
};

module.exports = updateCompany;
