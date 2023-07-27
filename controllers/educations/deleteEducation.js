const { User, Education } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const deleteEducation = async (req, res, next) => {
  const { _id } = req.user;
  const { educationId } = req.params;

  const education = await Education.findById({ _id: educationId });

  if (!education || (await education.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Education.findByIdAndDelete({ _id: educationId })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location educationId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await User.updateOne({ education: { $elemMatch: { $eq: education._id } } }, { $pull: { education: education._id } });

  res.json({
    status: "success",
    message: "Education successfully deleted",
    data: { education: transformers.educationTransformer(result) },
  });
};

module.exports = deleteEducation;
