const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllCompanies = require("./getAllCompanies");
const getCompaniesByQuery = require("./getCompaniesByQuery");
const createCompany = require("./createCompany");
const updateCompany = require("./updateCompany");
const deleteCompany = require("./deleteCompany");
const getCompanyById = require("./getCompanyById");
const ownerAdd = require("./ownerAdd");
const ownerRemove = require("./ownerRemove");
const workerAdd = require("./workerAdd");
const workerRemove = require("./workerRemove");

module.exports = {
  getAllCompanies: ctrlWrapper(getAllCompanies),
  getCompaniesByQuery: ctrlWrapper(getCompaniesByQuery),
  createCompany: ctrlWrapper(createCompany),
  updateCompany: ctrlWrapper(updateCompany),
  deleteCompany: ctrlWrapper(deleteCompany),
  getCompanyById: ctrlWrapper(getCompanyById),
  ownerAdd: ctrlWrapper(ownerAdd),
  ownerRemove: ctrlWrapper(ownerRemove),
  workerAdd: ctrlWrapper(workerAdd),
  workerRemove: ctrlWrapper(workerRemove),
};
