const { Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const getCompanyById = async (req, res, next) => {
  const { companyId } = req.params;
  const { path, page, perPage } = req.query;

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(perPage) || 10;

  let populateOptions = "";
  let othersPath = [];
  switch (path) {
    case "workers":
      populateOptions =
        "_id surname name avatarURL email subscription favorite publications about education experience frame headLine languages other1 other2 other3 phone site";
      othersPath = ["publications", "jobs"];
      break;
    case "publications":
      populateOptions = "description createdAt updatedAt";
      othersPath = ["workers", "jobs"];
      break;
    case "jobs":
      populateOptions = "";
      othersPath = ["workers", "publications"];
      break;
    default:
      break;
  }

  const company = await Company.findById({ _id: companyId })
    .populate({
      path,
      select: populateOptions,
      options: {
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      },
    })
    .populate({
      path: othersPath[0],
      select: "",
      options: {
        limit: 20,
      },
    })
    .populate({
      path: othersPath[1],
      select: "",
      options: {
        limit: 20,
      },
    })
    .populate({
      path: "avatarURL",
      select: "url",
    })
    .lean();

  if (!company) {
    return next(HttpError(404, "Not found"));
  }
  const companyCounter = await Company.findById({ _id: companyId });
  const totalWorkers = companyCounter[path].length;

  const totalPages = Math.ceil(totalWorkers / pageSize);
  const currentPage = pageNumber;

  res.status(200).json({
    status: "success",
    message: "Successfully found the company",
    data: {
      company: transformers.companyTransformer(company),
      workers: company.workers,
      [path]: company[path],
      [othersPath[0]]: company[othersPath[0]],
      [othersPath[1]]: company[othersPath[1]],
      totalPages,
      currentPage,
      perPage: pageSize,
    },
  });
};

module.exports = getCompanyById;
