const { Language } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateLanguage = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { languageId } = req.params;

  const language = await Language.findById({ _id: languageId });

  if (!language || (await language.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedLanguage = await Language.findByIdAndUpdate(languageId, updateData, {
    new: true, // return updated language
  });

  if (!updatedLanguage) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated the language",
    data: { language: transformers.languageTransformer(updatedLanguage) },
  });
};

module.exports = updateLanguage;
