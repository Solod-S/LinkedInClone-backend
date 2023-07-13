const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createSkill = require("./createSkill");
const deleteSkill = require("./deleteSkill");
const getAllSkills = require("./getAllSkills");
const getOwnSkills = require("./getOwnSkills");
const getSkillByQuery = require("./getSkillByQuery");
const getSkillById = require("./getSkillById");
const userAdd = require("./userAdd");
const userRemove = require("./userRemove");
const updateSkill = require("./updateSkill");


module.exports = {
  createSkill: ctrlWrapper(createSkill),
  deleteSkill: ctrlWrapper(deleteSkill),
  getAllSkills: ctrlWrapper(getAllSkills),
  getOwnSkills: ctrlWrapper(getOwnSkills),
  getSkillByQuery: ctrlWrapper(getSkillByQuery),
  getSkillById: ctrlWrapper(getSkillById),
  userAdd: ctrlWrapper(userAdd),
  userRemove: ctrlWrapper(userRemove),
  updateSkill: ctrlWrapper(updateSkill),
};
