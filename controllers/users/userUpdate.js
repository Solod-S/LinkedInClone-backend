const { User } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const userUpdate = async (req, res, next) => {
  const { _id } = req.user;
  const updateData = req.body; // new data from req.body

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
    new: true, // return updated company
  }).populate({
    path: "avatarURL",
    select: "url",
  });

  if (!updatedUser) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated user",
    data: { user: transformers.userTransformer(updatedUser) },
  });
};

module.exports = userUpdate;
