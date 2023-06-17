const { User, Experience } = require("../../models");

const { experienceTransformer } = require("../../helpers/index");

const addExperience = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  const newExperience = await Experience.create({
    ...req.body,
    owner: req.user._id,
  });

  user.experience.push(newExperience._id);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Experience successfully created",
    data: { experience: experienceTransformer(newExperience) },
  });
};

module.exports = addExperience;
