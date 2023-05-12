const { MediaFile } = require("../../models");

const { mediaFileTransformer } = require("../../helpers/index");

const addMediaFile = async (req, res, next) => {
  const newMediaFile = await MediaFile.create({
    ...req.body,
    owner: req.user._id,
  });

  res.json({ status: "success", data: { mediaFile: mediaFileTransformer(newMediaFile) } });
};

module.exports = addMediaFile;
