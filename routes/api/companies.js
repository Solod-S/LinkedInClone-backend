const companiesRouter = require("express").Router();

const { companies } = require("../../controllers");
const { validateBody, authenticate, isCompanyOwnerMiddleware } = require("../../middlewares");
const { companySchemas } = require("../../models");

//  get all companies
// companiesRouter.get("/", authenticate, companies.getAllSkills);

//  create company
companiesRouter.post(
  "/create",
  authenticate,
  validateBody(companySchemas.createCompanySchema),
  companies.createCompany
);

// //  search company by query
// companiesRouter.get("/search", authenticate, companies.getSkillByQuery);

// //  get company by id
// companiesRouter.get("/:companyId", authenticate, companies.getSkillById);

// //  add owner to company
// companiesRouter.get("/owners/add/:companyId", authenticate, companies.userAdd);

// //  remove owner from company
// companiesRouter.get("/owners/remove/:companyId", authenticate, companies.userRemove);

//  delete company
// companiesRouter.delete("/remove/:companyId", isAdminMiddleware, companies.deleteSkill);

//  update company
companiesRouter.patch(
  "/update/:companyId",
  isCompanyOwnerMiddleware,
  validateBody(companySchemas.updateCompanySchema),
  companies.updateCompany
);

module.exports = companiesRouter;
