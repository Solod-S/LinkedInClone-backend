const publicationsRouter = require("express").Router();

const { publications } = require("../../controllers");
const { authenticate } = require("../../middlewares");

//  get all publications
publicationsRouter.get("/", authenticate, publications.getAllPublications);

//  get popular publications
publicationsRouter.get("/popular", authenticate, publications.getPopularPublications);

// //  search publications by query
publicationsRouter.get("/search", authenticate, publications.getPublicationsByQuery);

// //  get publication by id
publicationsRouter.get("/:publicationId", authenticate, publications.getPublicationById);

module.exports = publicationsRouter;
