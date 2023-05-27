const { User, Post } = require("../../models");
const { postTransformer } = require("../../helpers/index");

const getFavorites = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id });

  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = user.favorite.length;
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if (user.favorite.length <= 0) {
    return res.json({
      status: "success",
      data: {
        ownPosts: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownPosts = await Post.find({ _id: { $in: user.favorite } })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    })
    .populate({
      path: "likes",
      select: "owner type",
      populate: { path: "owner", select: "_id surname name avatarURL" },
    });

  res.json({
    status: "success",
    data: {
      posts: ownPosts.map((post) => postTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getFavorites;
