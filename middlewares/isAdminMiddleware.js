const { User } = require("../models");

const jwt = require("jsonwebtoken");

const { ADMINS } = process.env;

const { HttpError } = require("../routes/errors/HttpErrors");
const { SECRET_KEY } = process.env;

const isAdminMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    const mayPass = ADMINS.includes(user.email);

    if (!user || !user.token || user.token !== token || !mayPass) {
      next(HttpError(403, "Access denied. Admin rights required"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = isAdminMiddleware;
