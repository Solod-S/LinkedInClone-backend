const companiesRouter = require("express").Router();

const { companies } = require("../../controllers");
const { validateBody, authenticate, isCompanyOwnerMiddleware } = require("../../middlewares");
const { companySchemas } = require("../../models");

//  get all companies
companiesRouter.get("/", authenticate, companies.getAllCompanies);

//  create company
companiesRouter.post(
  "/create",
  authenticate,
  validateBody(companySchemas.createCompanySchema),
  companies.createCompany
);

// //  search company by query
companiesRouter.get("/search", authenticate, companies.getCompaniesByQuery);

// //  get company by id
companiesRouter.get("/:companyId", authenticate, companies.getCompanyById);

//  add owner to company
companiesRouter.get("/owners/add/:companyId", isCompanyOwnerMiddleware, companies.ownerAdd);

// //  remove owner from company
companiesRouter.get("/owners/remove/:companyId", isCompanyOwnerMiddleware, companies.ownerRemove);

//  delete company
companiesRouter.delete("/remove/:companyId", isCompanyOwnerMiddleware, companies.deleteCompany);

//  update company
companiesRouter.patch(
  "/update/:companyId",
  isCompanyOwnerMiddleware,
  validateBody(companySchemas.updateCompanySchema),
  companies.updateCompany
);

module.exports = companiesRouter;
