const { MediaFile } = require("../../models");

const { mediaFileTransformer } = require("../../helpers/index");

const getAllMediaFiles = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const count = await MediaFile.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await MediaFile.find()).length <= 0) {
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

  const ownMediaFiles = await MediaFile.find()
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({ path: "owner", select: "_id name avatarURL" });

  res.json({
    status: "success",
    data: {
      ownMediaFiles: ownMediaFiles.map((mediaFiles) => mediaFileTransformer(mediaFiles)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllMediaFiles;
