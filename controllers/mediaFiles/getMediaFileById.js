const { MediaFile } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const getMediaFileById = async (req, res, next) => {
  const { mediaFileId } = req.params;

  const mediaFile = await MediaFile.findById({ _id: mediaFileId })
    .populate({ path: "owner", select: "_id surname name avatarURL" })
    .populate({
      path: "postId",
      select: "_id description likes comments mediaFiles owner type",
      populate: [
        {
          path: "comments",
          select: "owner description likes mediaFiles createdAt updatedAt",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: { path: "owner", select: "_id surname name avatarURL" },
        },
      ],
    })
    .populate({
      path: "commentId",
      select: "_id description likes comments mediaFiles owner type",
      populate: {
        path: "likes",
        select: "_id type owner",
        populate: { path: "owner", select: "_id surname name avatarURL" },
      },
    })
    .populate({
      path: "educationId",
      select:
        "_id school degree activitiesAndSocieties fieldOfStudy description startDate endDate skills mediaFiles owner",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        },
        {
          path: "skills",
          select: "skill createdAt updatedAt",
        },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
      ],
    })
    .populate({
      path: "experienceId",
      select: "_id companyName employmentType position location locationType startDate endDate skills mediaFiles",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        },
        {
          path: "skills",
          select: "skill createdAt updatedAt",
        },
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
      ],
    })
    .populate({
      path: "publicationId",
      select: "_id description ",
      populate: [
        {
          path: "owner",
          select: "_id name description industry location website email phone foundedYear employeesCount avatarURL",
        },
        {
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
        {
          path: "mediaFiles",
          select: "url type owner location createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
      ],
    })
    .populate({
      path: "userId",
      select:
        "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
    });

  if (!mediaFile) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully get the media file",
    data: {
      mediaFile: mediaFileTransformer(mediaFile),
    },
  });
};

module.exports = getMediaFileById;
