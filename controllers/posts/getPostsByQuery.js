const { Post } = require("../../models");
// const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const getPostsByQuery = async (req, res, next) => {
  const { search } = req.query;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const trimmedKeyword = search.trim();
  const skip = (page - 1) * perPage;

  const count = await Post.countDocuments();
  const totalPages = Math.ceil(count / perPage);
  const query = { description: { $regex: trimmedKeyword, $options: "i" } };

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Post.find()).length <= 0) {
    return res.json({
      status: "success",
      data: {
        posts: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id name avatarURL" },
    })
    .populate({ path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id name avatarURL" },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } },
        { path: "mediaFiles", select: "url type owner", populate: { path: "owner", select: "_id name avatarURL" } },
      ],
    })
    .populate({ path: "owner", select: "_id name avatarURL" });

  res.status(200).json({
    status: "success",
    data: { posts: posts.map((post) => postTransformer(post)), totalPages, currentPage: page, perPage },
  });
};

module.exports = getPostsByQuery;
