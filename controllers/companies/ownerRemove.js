const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const ownerRemove = async (req, res, next) => {
  const { user = "" } = req.query;
  const { companyId } = req.params;

  const company = await Company.findById({ _id: companyId });

  if (!company || !company.owners.includes(user)) {
    throw HttpError(404, "Not found");
  }

  company.owners.pull(user);
  await company.save();

  res.status(201).json({
    status: "success",
    message: "User was successfully removed from this company owners",
    data: {
      company: companyTransformer(company),
    },
  });
};

module.exports = ownerRemove;
