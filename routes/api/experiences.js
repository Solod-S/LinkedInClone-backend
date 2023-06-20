const experiencesRouter = require("express").Router();

const { experiences } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { experienceSchemas } = require("../../models");

//  get own experiences
experiencesRouter.get("/", authenticate, experiences.getOwnExperiences);

// create new experience
experiencesRouter.post(
  "/add",
  authenticate,
  validateBody(experienceSchemas.createExperienceSchema),
  experiences.addExperience
);

//  remove experience
experiencesRouter.delete("/remove/:expId", authenticate, experiences.deleteExperience);

//  update experience
experiencesRouter.patch(
  "/update/:expId",
  authenticate,
  validateBody(experienceSchemas.updateExperienceSchema),
  experiences.updateExperience
);

module.exports = experiencesRouter;
