const { User, Company } = require("../models");

const jwt = require("jsonwebtoken");

const { HttpError } = require("../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const isCompanyOwnerMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  const { companyId } = req.params;

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    const company = await Company.findById(companyId);
    // const mayPass = company.owners[0].toString() === user._id.toString();
    const mayPass = company.owners.includes(user._id.toString());

    if (!user || !user.token || user.token !== token || !mayPass) {
      next(HttpError(403, "Access denied. Company admin rights required"));
    }
    req.user = user;
    req.company = company;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = isCompanyOwnerMiddleware;
