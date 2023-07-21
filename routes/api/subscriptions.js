const subscriptionsRouter = require("express").Router();

const { subscriptions } = require("../../controllers");
const { authenticate } = require("../../middlewares");

//  get users subscriptions
subscriptionsRouter.get("/users", authenticate, subscriptions.getSubscriptions);

//  add user to subscriptions
subscriptionsRouter.get("/users/add/:subscriptionId", authenticate, subscriptions.addSubscription);

//  delete user from from subscriptions
subscriptionsRouter.get("/users/remove/:subscriptionId", authenticate, subscriptions.deleteSubscription);

module.exports = subscriptionsRouter;
