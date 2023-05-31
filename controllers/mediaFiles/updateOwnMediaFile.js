const { MediaFile } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const updateOwnMediaFile = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { mediaFileId } = req.params;

  const mediaFile = await MediaFile.findById({ _id: mediaFileId });

  if (!mediaFile || (await mediaFile.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedMediaFile = await MediaFile.findByIdAndUpdate(mediaFileId, updateData, {
    new: true, // return updated post
  });

  if (!updatedMediaFile) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated media file",
    data: { mediaFile: mediaFileTransformer(updatedMediaFile) },
  });
};

module.exports = updateOwnMediaFile;
