const { User, Education } = require("../../models");

const { educationTransformer } = require("../../helpers/index");

const addEducation = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  const newEducation = await Education.create({
    ...req.body,
    owner: req.user._id,
  });

  user.education.push(newEducation._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Education successfully created",
    data: { education: educationTransformer(newEducation) },
  });
};

module.exports = addEducation;
