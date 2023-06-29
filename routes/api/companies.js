const companiesRouter = require("express").Router();

const { companies } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { companySchemas } = require("../../models");

// get all companies
companiesRouter.get("/", authenticate, companies.getAllCompanies);

//  create company
companiesRouter.post(
  "/create",
  authenticate,
  validateBody(companySchemas.createCompanySchema),
  companies.createCompany
);

//  search company by query
companiesRouter.get("/search", authenticate, companies.getCompaniesByQuery);

//  get company by id
companiesRouter.get("/:companyId", authenticate, companies.getCompanyById);

//  add owner to company
companiesRouter.get("/owners/add/:companyId", authenticate, companies.ownerAdd);

//  remove owner from company
companiesRouter.get("/owners/remove/:companyId", authenticate, companies.ownerRemove);

//  add worker to company
companiesRouter.get("/workers/add/:companyId", authenticate, companies.workerAdd);

//  remove worker from company
companiesRouter.get("/workers/remove/:companyId", authenticate, companies.workerRemove);

//  delete company
companiesRouter.delete("/remove/:companyId", authenticate, companies.deleteCompany);

//  update company
companiesRouter.patch(
  "/update/:companyId",
  authenticate,
  validateBody(companySchemas.updateCompanySchema),
  companies.updateCompany
);

module.exports = companiesRouter;
