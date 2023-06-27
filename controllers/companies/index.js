const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createCompany = require("./createCompany");
const updateCompany = require("./updateCompany");
const deleteCompany = require("./deleteCompany");
const getCompanyById = require("./getCompanyById");
const ownerAdd = require("./ownerAdd");
const ownerRemove = require("./ownerRemove");

module.exports = {
  createCompany: ctrlWrapper(createCompany),
  updateCompany: ctrlWrapper(updateCompany),
  deleteCompany: ctrlWrapper(deleteCompany),
  getCompanyById: ctrlWrapper(getCompanyById),
  ownerAdd: ctrlWrapper(ownerAdd),
  ownerRemove: ctrlWrapper(ownerRemove),
};
