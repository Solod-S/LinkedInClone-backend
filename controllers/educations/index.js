const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addEducation = require("./addEducation");
const deleteEducation = require("./deleteEducation");
const updateEducation = require("./updateEducation");

module.exports = {
  addEducation: ctrlWrapper(addEducation),
  deleteEducation: ctrlWrapper(deleteEducation),
  updateEducation: ctrlWrapper(updateEducation),
};
