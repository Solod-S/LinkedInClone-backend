const { Education } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateEducation = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { educationId } = req.params;

  const education = await Education.findById({ _id: educationId });

  if (!education || (await education.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedEducation = await Education.findByIdAndUpdate(educationId, updateData, {
    new: true, // return updated education
  })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location educationId createdAt updatedAt owner",
    })
    .populate({
      path: "skills",
      select: "skill createdAt updatedAt",
    });

  if (!updatedEducation) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated an education",
    data: { education: transformers.educationTransformer(updatedEducation) },
  });
};

module.exports = updateEducation;
