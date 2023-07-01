const ownPublicationsRouter = require("express").Router();

const { ownPublications } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { publicationSchemas } = require("../../models");

//  get own publications
ownPublicationsRouter.get("/", authenticate, ownPublications.getOwnPublication);

//  create a new publication
ownPublicationsRouter.post(
  "/add",
  authenticate,
  validateBody(publicationSchemas.createPublicationSchema),
  ownPublications.addOwnPublication
);

//  update an own publication
ownPublicationsRouter.patch(
  "/update/:publicationId",
  authenticate,
  validateBody(publicationSchemas.updatePublicationSchema),
  ownPublications.updateOwnPublication
);

//  delete own publication
ownPublicationsRouter.delete("/remove/:publicationId", authenticate, ownPublications.deleteOwnPublication);

module.exports = ownPublicationsRouter;
