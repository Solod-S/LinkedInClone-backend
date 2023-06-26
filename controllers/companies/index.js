const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createCompany = require("./createCompany");
const updateCompany = require("./updateCompany");

module.exports = {
  createCompany: ctrlWrapper(createCompany),
  updateCompany: ctrlWrapper(updateCompany),
};
