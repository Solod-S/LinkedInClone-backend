const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const createSkill = require("./createSkill");
const deleteSkill = require("./deleteSkill");

module.exports = {
  createSkill: ctrlWrapper(createSkill),
  deleteSkill: ctrlWrapper(deleteSkill),
};
