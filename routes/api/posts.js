const postsRouter = require("express").Router();

const { posts } = require("../../controllers");
const { authenticate } = require("../../middlewares");

//  get all posts
postsRouter.get("/", authenticate, posts.getAllPosts);

// //  get post by id
postsRouter.get("/:postId", authenticate, posts.getPostById);

// //  get popular posts
// postsRouter.get("/popular", authenticate, posts.getPopularPosts);

// //  search posts by query
postsRouter.get("/search/:keyWord", authenticate, posts.getPostsByQuery);

module.exports = postsRouter;
