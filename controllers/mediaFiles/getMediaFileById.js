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
