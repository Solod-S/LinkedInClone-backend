const languagesRouter = require("express").Router();

const { languages } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { languagesSchemas } = require("../../models");

//  get own language
languagesRouter.get("/", authenticate, languages.getOwnLanguages);

// create new language
languagesRouter.post("/add", authenticate, validateBody(languagesSchemas.createlanguageSchema), languages.addLanguage);

//  remove language
languagesRouter.delete("/remove/:languageId", authenticate, languages.deleteLanguage);

//  update language
languagesRouter.patch(
  "/update/:languageId",
  authenticate,
  validateBody(languagesSchemas.updateLanguageSchema),
  languages.updateLanguage
);

module.exports = languagesRouter;
