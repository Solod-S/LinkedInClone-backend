const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const ownerRemove = async (req, res, next) => {
  const { _id } = req.user;
  const { user = "" } = req.query;
  const { companyId } = req.params;

  const company = await Company.findById({ _id: companyId }).populate({
    path: "avatarURL",
    select: "url",
  });

  if (!company || !company.owners.includes(user) || !company.owners.includes(_id)) {
    throw HttpError(404, "Not found");
  }

  company.owners.pull(user);
  await company.save();

  res.status(200).json({
    status: "success",
    message: "User was successfully removed from this company owners",
    data: {
      company: transformers.companyTransformer(company),
    },
  });
};

module.exports = ownerRemove;
