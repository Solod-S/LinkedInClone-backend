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

// //  get post by id
skillsRouter.get("/:skillId", authenticate, skills.getSkillById);

// //  add user to skill
skillsRouter.get("/users/add/:skillId", authenticate, skills.userAdd);

// //  remove user from skill
skillsRouter.get("/users/remove/:skillId", authenticate, skills.userRemove);

module.exports = skillsRouter;
