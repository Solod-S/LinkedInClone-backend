const { Experience } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateExperience = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { expId } = req.params;

  const experience = await Experience.findById({ _id: expId });

  if (!experience || (await experience.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedExperience = await Experience.findByIdAndUpdate(expId, updateData, {
    new: true, // return updated experience
  })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location experienceId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  if (!updatedExperience) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated an experience",
    data: { experience: transformers.experienceTransformer(updatedExperience) },
  });
};

module.exports = updateExperience;
