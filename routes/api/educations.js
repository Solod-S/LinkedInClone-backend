const educationsRouter = require("express").Router();

const { educations } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { educationsSchemas } = require("../../models");

//  get own experiences
educationsRouter.get("/", authenticate, educations.getOwnEducations);

// create new experience
educationsRouter.post(
  "/add",
  authenticate,
  validateBody(educationsSchemas.createEducationSchema),
  educations.addEducation
);

//  remove experience
educationsRouter.delete("/remove/:educationId", authenticate, educations.deleteEducation);

//  update experience
educationsRouter.patch(
  "/update/:educationId",
  authenticate,
  validateBody(educationsSchemas.updateeducationSchema),
  educations.updateEducation
);

module.exports = educationsRouter;
