const { User, Experience } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { experienceTransformer } = require("../../helpers/index");

const deleteExperience = async (req, res, next) => {
  const { _id } = req.user;
  const { expId } = req.params;

  const experience = await Experience.findById({ _id: expId });

  if (!experience || (await experience.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Experience.findByIdAndDelete({ _id: expId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location experienceId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await User.updateOne(
    { experience: { $elemMatch: { $eq: experience._id } } },
    { $pull: { experience: experience._id } }
  );

  res.json({
    status: "success",
    message: "Experience successfully deleted",
    data: { experience: experienceTransformer(result) },
  });
};

module.exports = deleteExperience;
