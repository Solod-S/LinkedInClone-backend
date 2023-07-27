const { Publication, Company } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateOwnPublication = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { publicationId } = req.params;

  const company = await Company.findOne({ owners: _id });
  const publication = await Publication.findById({ _id: publicationId });

  if (!publication || !company) {
    throw HttpError(404, "Not found");
  }

  const updatedPublication = await Publication.findByIdAndUpdate(publicationId, updateData, {
    new: true, // return updated publication
  })
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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

  if (!updatedPublication) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated the publication",
    data: { publication: transformers.publicationTransformer(updatedPublication) },
  });
};

module.exports = updateOwnPublication;
