const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addExperience = require("./addExperience");
const deleteExperience = require("./deleteExperience");
const updateExperienceSchema = require("./updateExperience");
const getOwnExperiences = require("./getOwnExperiences");

module.exports = {
  addExperience: ctrlWrapper(addExperience),
  deleteExperience: ctrlWrapper(deleteExperience),
  updateExperienceSchema: ctrlWrapper(updateExperienceSchema),
  getOwnExperiences: ctrlWrapper(getOwnExperiences),
};
