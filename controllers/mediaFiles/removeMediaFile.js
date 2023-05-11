const { MediaFile } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const removeMediaFile = async (req, res, next) => {
  const { _id } = req.user;
  const { mediaFileId } = req.params;

  const mediaFile = await MediaFile.findById({ _id: mediaFileId });

  if (!mediaFile || (await mediaFile.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await MediaFile.findByIdAndDelete({ _id: mediaFileId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ status: "success", data: { deletedMediaFile: mediaFileTransformer(result) } });
};

module.exports = removeMediaFile;
