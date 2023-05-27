const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getFavorites = require("./getFavorites");
const addFavorite = require("./addFavorite");
const deleteFavorite = require("./deleteFavorite");

module.exports = {
  getFavorites: ctrlWrapper(getFavorites),
  addFavorite: ctrlWrapper(addFavorite),
  deleteFavorite: ctrlWrapper(deleteFavorite),
};
