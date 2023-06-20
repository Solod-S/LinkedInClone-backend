const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addExperience = require("./addExperience");
const deleteExperience = require("./deleteExperience");
const updateExperience = require("./updateExperience");
const getOwnExperiences = require("./getOwnExperiences");

module.exports = {
  addExperience: ctrlWrapper(addExperience),
  deleteExperience: ctrlWrapper(deleteExperience),
  updateExperience: ctrlWrapper(updateExperience),
  getOwnExperiences: ctrlWrapper(getOwnExperiences),
};
