const favoritesRouter = require("express").Router();

const { favorites } = require("../../controllers");
const { authenticate } = require("../../middlewares");

//  get favorite posts
favoritesRouter.get("/posts", authenticate, favorites.getFavorites);

//  add to favorites
favoritesRouter.get("/posts/add/:postId", authenticate, favorites.addFavorite);

//  delete from favorites
favoritesRouter.delete("/posts/remove/:postId", authenticate, favorites.deleteFavorite);

module.exports = favoritesRouter;
