const { Publication, Company } = require("../../models");

const { publicationTransformer } = require("../../helpers/index");

const getOwnPublication = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const company = await Company.findOne({ owners: _id });
  const count = await Publication.countDocuments({ owner: company._id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if ((await Publication.find({ owner: company._id })).length <= 0) {
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

  const ownPublication = await Publication.find({ owner: company._id })
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
        },
        {
          path: "mediaFiles",
          select: "url type providerPublicId location commentId owner createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
        {
          path: "likes",
          select: "owner type createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
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
      },
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription about education experience frame headLine languages other1 other2 other3 phone site",
      },
    })
    .populate({
      path: "owner",
      select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
    });

  res.json({
    status: "success",
    message: "Successfully get publications",
    data: {
      publications: ownPublication.map((publication) => publicationTransformer(publication)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getOwnPublication;
