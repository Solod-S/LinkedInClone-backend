const { User, Language } = require("../../models");

const { transformers } = require("../../helpers/index");

const addLanguage = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  const newLanguage = await Language.create({
    ...req.body,
    owner: req.user._id,
  });

  user.languages.push(newLanguage._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Language successfully created",
    data: { language: transformers.languageTransformer(newLanguage) },
  });
};

module.exports = addLanguage;
