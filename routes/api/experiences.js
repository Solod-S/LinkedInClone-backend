const experienceRouter = require("express").Router();

const { experiences } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { experienceSchemas } = require("../../models");

//  get own experiences
experienceRouter.get("/", authenticate, experiences.getOwnExperiences);

// create new experience
experienceRouter.post(
  "/add",
  authenticate,
  validateBody(experienceSchemas.createExperienceSchema),
  experiences.addExperience
);

//  remove experience
experienceRouter.delete("/remove/:expId", authenticate, experiences.deleteExperience);

//  update experience
experienceRouter.patch(
  "/update/:expId",
  authenticate,
  validateBody(experienceSchemas.updateExperienceSchema),
  experiences.updateExperienceSchema
);

module.exports = experienceRouter;
