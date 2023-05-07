const { Post } = require("../../models");

const { ownPostTransformer } = require("../../helpers/index");

const getOwnPosts = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Post.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const ownPosts = await Post.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  res.json({
    status: "success",
    data: {
      ownPosts: ownPosts.map((post) => ownPostTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnPosts;
