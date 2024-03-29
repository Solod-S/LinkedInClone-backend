const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const workerAdd = async (req, res, next) => {
  const { _id } = req.user;
  const { companyId } = req.params;
  const { user = "" } = req.query;
  const company = await Company.findById({ _id: companyId }).populate({
    path: "avatarURL",
    select: "url",
  });
  if (!company || !company.owners.includes(_id)) {
    throw HttpError(404, "Not found");
  }

  if (company.workers.includes(user)) {
    throw HttpError(409, `Sorry, the user was added to this company workers before`);
  }

  company.workers.push(user);
  await company.save();

  res.status(200).json({
    status: "success",
    message: "User was successfully added to this company workers",
    data: {
      company: transformers.companyTransformer(company),
    },
  });
};

module.exports = workerAdd;
