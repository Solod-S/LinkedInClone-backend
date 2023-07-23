const { Comment, MediaFile, Like, Company, Publication } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { publicationTransformer } = require("../../helpers/index");

const deleteOwnPublication = async (req, res, next) => {
  const { _id } = req.user;
  const { publicationId } = req.params;

  const publication = await Publication.findById({ _id: publicationId });
  const company = await Company.findOne({ owners: _id });

  if (!publication || !company) {
    throw HttpError(404, "Not found");
  }

  const result = await Publication.findByIdAndDelete({ _id: publicationId })
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

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await Company.updateOne(
    { publications: { $elemMatch: { $eq: publication._id } } },
    { $pull: { publications: publication._id } }
  );
  await Comment.deleteMany({ _id: { $in: publication.comments } });
  await MediaFile.deleteMany({ _id: { $in: publication.mediaFiles } });
  await Like.deleteMany({ _id: { $in: publication.likes } });

  res.json({
    status: "success",
    message: "Publication successfully deleted",
    data: { publication: publicationTransformer(result) },
  });
};

module.exports = deleteOwnPublication;
