const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const workerRemove = async (req, res, next) => {
  const { _id } = req.user;
  const { user = "" } = req.query;
  const { companyId } = req.params;

  const company = await Company.findById({ _id: companyId });

  if (!company || !company.workers.includes(user) || !company.owners.includes(_id)) {
    throw HttpError(404, "Not found");
  }

  company.workers.pull(user);
  await company.save();

  res.status(200).json({
    status: "success",
    message: "User was successfully removed from this company workers",
    data: {
      company: companyTransformer(company),
    },
  });
};

module.exports = workerRemove;
