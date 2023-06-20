const { User, Education } = require("../../models");

const { educationTransformer } = require("../../helpers/index");

const addEducation = async (req, res, next) => {
  const { _id } = req.user;

  console.log(req.body, _id);

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
    data: { experience: educationTransformer(newEducation) },
  });
};

module.exports = addEducation;
