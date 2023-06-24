const { User, Language } = require("../../models");

const { languageTransformer } = require("../../helpers/index");

const addLanguage = async (req, res, next) => {
  const { _id } = req.user;

  console.log(req.body, _id);

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
    data: { language: languageTransformer(newLanguage) },
  });
};

module.exports = addLanguage;
