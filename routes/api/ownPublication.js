const ownPublicationsRouter = require("express").Router();

const { ownPublications } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { publicationSchemas } = require("../../models");

//  get own publications
// ownPublicationsRouter.get("/", authenticate, ownPublications.getownPublications);

//  create a new publication
// ownPublicationsRouter.post(
//   "/add",
//   authenticate,
//   validateBody(publicationSchemas.createPostSchema),
//   ownPublications.addownPublication
// );

//  update an own publication
// ownPublicationsRouter.patch(
//   "/update/:publicationId",
//   authenticate,
//   validateBody(publicationSchemas.updatecreatePostSchema),
//   ownPublications.updateownPublication
// );

//  delete own publication
// ownPublicationsRouter.delete("/remove/:publicationId", authenticate, ownPublications.deleteownPublication);

module.exports = ownPublicationsRouter;
