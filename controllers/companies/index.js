const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createCompany = require("./createCompany");
const updateCompany = require("./updateCompany");
const deleteCompany = require("./deleteCompany");
const ownerAdd = require("./ownerAdd");

module.exports = {
  createCompany: ctrlWrapper(createCompany),
  updateCompany: ctrlWrapper(updateCompany),
  deleteCompany: ctrlWrapper(deleteCompany),
  ownerAdd: ctrlWrapper(ownerAdd),
};
