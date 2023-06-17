const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addExperience = require("./addExperience");
const deleteExperience = require("./deleteExperience");

module.exports = {
  addExperience: ctrlWrapper(addExperience),
  deleteExperience: ctrlWrapper(deleteExperience),
};
