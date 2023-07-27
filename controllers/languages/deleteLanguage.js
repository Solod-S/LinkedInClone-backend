const { User, Language } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const deleteLanguage = async (req, res, next) => {
  const { _id } = req.user;
  const { languageId } = req.params;

  const language = await Language.findById({ _id: languageId });

  if (!language || (await language.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await Language.findByIdAndDelete({ _id: languageId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  await User.updateOne({ languages: { $elemMatch: { $eq: language._id } } }, { $pull: { languages: language._id } });

  res.json({
    status: "success",
    message: "Language successfully deleted",
    data: { language: transformers.languageTransformer(result) },
  });
};

module.exports = deleteLanguage;
