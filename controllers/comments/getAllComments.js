const { Comment } = require("../../models");

const { commentTransformer } = require("../../helpers/index");

const getAllComments = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await Comment.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Comment.find({ owner: _id })).length <= 0) {
    return res.json({
      status: "success",
      data: {
        ownComments: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const ownComments = await Comment.find({ owner: _id })
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "owner",
      select: "name surname email avatarURL favorite",
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
      ownComments: ownComments.map((post) => commentTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllComments;
