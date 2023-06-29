const { Publication, Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { publicationTransformer } = require("../../helpers/index");

const addOwnPublication = async (req, res, next) => {
  const { _id } = req.user;

  const company = await Company.findOne({ owners: _id });

  if (!company) {
    throw HttpError(404, "Not found");
  }

  const newPublication = await Publication.create({
    ...req.body,
    owner: company._id,
  });

  company.publications.push(newPublication._id);
  await company.save();

  const publication = await Publication.findById({ _id: newPublication._id })
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        },
        {
          path: "mediaFiles",
          select: "url type providerPublicId location commentId owner createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
        {
          path: "likes",
          select: "owner type createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      },
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      },
    })
    .populate({
      path: "owner",
      select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
    });

  res.status(201).json({
    status: "success",
    message: "Publication successfully created",
    data: { publications: publicationTransformer(publication) },
  });
};

module.exports = addOwnPublication;
