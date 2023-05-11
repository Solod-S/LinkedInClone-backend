const { MediaFile } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const getMediaFileById = async (req, res, next) => {
  const { mediaFileId } = req.params;

  const mediaFile = await MediaFile.findById({ _id: mediaFileId });

  if (!mediaFile) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    data: {
      mediaFile: mediaFileTransformer(mediaFile),
    },
  });
};

module.exports = getMediaFileById;
