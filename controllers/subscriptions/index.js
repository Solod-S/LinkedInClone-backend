const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getSubscriptions = require("./getSubscriptions");
const addSubscription = require("./addSubscription");
const deleteSubscription = require("./deleteSubscription");

module.exports = {
  getSubscriptions: ctrlWrapper(getSubscriptions),
  addSubscription: ctrlWrapper(addSubscription),
  deleteSubscription: ctrlWrapper(deleteSubscription),
};
