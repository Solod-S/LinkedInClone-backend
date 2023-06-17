const experienceRouter = require("express").Router();

const { experiences } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { experienceSchemas } = require("../../models");

//  get all skills
// experienceRouter.get("/", authenticate, skills.getAllSkills);

// create new experience
experienceRouter.post(
  "/add",
  authenticate,
  validateBody(experienceSchemas.createExperience),
  experiences.addExperience
);

// // //  remove experience
experienceRouter.delete("/remove/:expId", authenticate, experiences.deleteExperience);

// search posts by query
// experienceRouter.get("/search", authenticate, skills.getSkillByQuery);

// // //  get post by id
// experienceRouter.get("/:skillId", authenticate, skills.getSkillById);

// // //  add user to skill
// experienceRouter.get("/users/add/:skillId", authenticate, skills.userAdd);

// //  delete skill
// experienceRouter.delete("/remove/:skillId", authenticate, skills.deleteSkill);

module.exports = experienceRouter;
