const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const ownerAdd = async (req, res, next) => {
  const { _id } = req.user;
  const { companyId } = req.params;
  console.log(`dddd111`);
  const company = await Company.findById({ _id: companyId });

  if (!company) {
    throw HttpError(404, "Not found");
  }

  if (company.owners.includes(_id)) {
    throw HttpError(409, `Sorry, the user was added to this company owners before`);
  }

  company.owners.push(_id);
  await company.save();

  res.status(201).json({
    status: "success",
    message: "User was successfully added to this company owners",
    data: {
      skill: companyTransformer(company),
    },
  });
};

module.exports = ownerAdd;
