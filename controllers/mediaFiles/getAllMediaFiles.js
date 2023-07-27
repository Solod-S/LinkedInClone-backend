const { MediaFile } = require("../../models");

const { transformers } = require("../../helpers/index");

const getAllMediaFiles = async (req, res, next) => {
  const { _id } = req.user;
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await MediaFile.countDocuments({ owner: _id });
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await MediaFile.find()).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get media files",
      data: {
        mediaFiles: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const allMediaFiles = await MediaFile.find()
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "owner",
      select:
        "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
    })
    .populate({
      path: "postId",
      select: "_id description likes comments mediaFiles owner type",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
      path: "commentId",
      select: "_id description likes comments mediaFiles owner type",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
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
      select: "_id description",
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
    });

  res.json({
    status: "success",
    message: "Successfully get media files",
    data: {
      mediaFiles: allMediaFiles.map((mediaFiles) => transformers.mediaFileTransformer(mediaFiles)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllMediaFiles;
