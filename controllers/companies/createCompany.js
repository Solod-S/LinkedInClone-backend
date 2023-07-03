const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { companyTransformer } = require("../../helpers/index");

const createCompany = async (req, res, next) => {
  const { _id } = req.user;
  const { name } = req.body;

  // Установка первой буквы в верхний регистр
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  const companyAlreadyExist =
    (await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })) ||
    (await Company.findOne({ owners: _id }));

  if (companyAlreadyExist) {
    throw HttpError(409, `Sorry, the company was created before`);
  }

  const newCompany = await Company.create({
    ...req.body,
    name: formattedName,
    owners: [_id],
  });

  res.status(201).json({
    status: "success",
    message: "Company successfully created",
    data: { company: companyTransformer(newCompany) },
  });
};

module.exports = createCompany;
