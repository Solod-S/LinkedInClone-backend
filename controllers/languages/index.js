const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addLanguage = require("./addLanguage");
const deleteLanguage = require("./deleteLanguage");
const getOwnLanguages = require("./getOwnLanguages");
const updateLanguage = require("./updateLanguage");

module.exports = {
  addLanguage: ctrlWrapper(addLanguage),
  deleteLanguage: ctrlWrapper(deleteLanguage),
  getOwnLanguages: ctrlWrapper(getOwnLanguages),
  updateLanguage: ctrlWrapper(updateLanguage),
};
