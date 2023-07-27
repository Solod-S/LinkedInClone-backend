const { Comment } = require("../../models");

const { transformers } = require("../../helpers/index");

const getAllComments = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Comment.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Comment.find({ owner: _id })).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get comments",
      data: {
        comments: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const comments = await Comment.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location createdAt updatedAt",
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
    })
    .populate({
      path: "owner",
      select: "_id surname name avatarURL",
    });

  res.json({
    status: "success",
    message: "Successfully get comments",
    data: {
      comments: comments.map((post) => transformers.commentTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllComments;
