const { Publication } = require("../../models");

const { transformers } = require("../../helpers/index");

const getAllPublications = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Publication.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Publication.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get publications",
      data: {
        publications: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const publications = await Publication.find({})
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
          populate: {
            path: "avatarURL",
            select: "url",
          },
        },
        {
          path: "mediaFiles",
          select: "url type providerPublicId location commentId owner createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
            populate: {
              path: "avatarURL",
              select: "url",
            },
          },
        },
        {
          path: "likes",
          select: "owner type createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
            populate: {
              path: "avatarURL",
              select: "url",
            },
          },
        },
      ],
    })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
        populate: {
          path: "avatarURL",
          select: "url",
        },
      },
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
        populate: {
          path: "avatarURL",
          select: "url",
        },
      },
    })
    .populate({
      path: "owner",
      select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
      populate: {
        path: "avatarURL",
        select: "url",
      },
    });

  res.json({
    status: "success",
    message: "Successfully get publications",
    data: {
      publications: publications.map((publication) => transformers.publicationTransformer(publication)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllPublications;
