const skillsRouter = require("express").Router();

const { skills } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { skillsSchemas } = require("../../models");

//  get all skills
skillsRouter.get("/", authenticate, skills.getAllSkills);

//  create skill
skillsRouter.post("/create", authenticate, validateBody(skillsSchemas.createSkillSchema), skills.createSkill);

//  delete skill
skillsRouter.delete("/remove/:skillId", authenticate, skills.deleteSkill);

// //  search posts by query
skillsRouter.get("/search", authenticate, skills.getSkillByQuery);

module.exports = skillsRouter;
