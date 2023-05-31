const { Post } = require("../../models");

const { postTransformer } = require("../../helpers/index");

const getAllPosts = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await Post.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Post.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get posts",
      data: {
        posts: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const posts = await Post.find({})
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
    })
    .populate({ path: "owner", select: "_id surname name avatarURL" });

  res.json({
    status: "success",
    message: "Successfully get posts",
    data: {
      posts: posts.map((post) => postTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllPosts;
