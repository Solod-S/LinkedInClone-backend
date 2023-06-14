const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createSkill = require("./createSkill");
const deleteSkill = require("./deleteSkill");
const getAllSkills = require("./getAllSkills");
const getSkillByQuery = require("./getSkillByQuery");

module.exports = {
  createSkill: ctrlWrapper(createSkill),
  deleteSkill: ctrlWrapper(deleteSkill),
  getAllSkills: ctrlWrapper(getAllSkills),
  getSkillByQuery: ctrlWrapper(getSkillByQuery),
};
