const { Publication } = require("../../models");

const { publicationTransformer } = require("../../helpers/index");

const getPublicationsByQuery = async (req, res, next) => {
  const { search = "" } = req.query;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const trimmedKeyword = search.trim();
  const skip = (page - 1) * perPage;

  const query = { description: { $regex: trimmedKeyword, $options: "i" } };
  const count = await Publication.countDocuments(query);
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  if (!search || (await Publication.find(query)).length <= 0 || (await Publication.find()).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully found such publications",
      data: {
        publications: [],
        totalPages: 0,
        currentPage: page,
        perPage,
      },
    });
  }

  const publications = await Publication.find(query)
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

  res.status(200).json({
    status: "success",
    message: "Successfully found such publications",
    data: {
      publications: publications.map((publication) => publicationTransformer(publication)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getPublicationsByQuery;
