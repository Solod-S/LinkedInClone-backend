const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const ownerAdd = async (req, res, next) => {
  const { companyId } = req.params;
  const { user = "" } = req.query;
  const company = await Company.findById({ _id: companyId });

  if (!company) {
    throw HttpError(404, "Not found");
  }

  if (company.owners.includes(user)) {
    throw HttpError(409, `Sorry, the user was added to this company owners before`);
  }

  company.owners.push(user);
  await company.save();

  res.status(201).json({
    status: "success",
    message: "User was successfully added to this company owners",
    data: {
      company: companyTransformer(company),
    },
  });
};

module.exports = ownerAdd;
