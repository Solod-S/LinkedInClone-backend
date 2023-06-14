const { User, Skill } = require("../../models");

const { userTransformer } = require("../../helpers/index");

const remove = async (req, res) => {
  const { _id } = req.user;

  const deletedUser = await User.findOneAndDelete({ _id }).populate({
    path: "posts",
    select: "description createdAt updatedAt",
    populate: [
      {
        path: "comments",
        select: "owner description likes mediaFiles createdAt updatedAt",
        populate: { path: "owner", select: "_id surname name avatarURL" },
      },
      { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
      {
        path: "mediaFiles",
        select: "url type owner location createdAt updatedAt",
        populate: { path: "owner", select: "_id surname name avatarURL" },
      },
    ],
  })
  .populate({
    path: "favorite",
    select: "description createdAt updatedAt",
    populate: [
      {
        path: "comments",
        select: "owner description likes mediaFiles createdAt updatedAt",
        populate: { path: "owner", select: "_id surname name avatarURL" },
      },
      { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
      {
        path: "mediaFiles",
        select: "url type owner location createdAt updatedAt",
        populate: { path: "owner", select: "_id surname name avatarURL" },
      },
    ],
  })
  .populate({
    path: "subscription",
    select:
      "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
    populate: [
      {
        path: "posts",
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
          { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
        ],
      },
      {
        path: "favorite",
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
          { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
        ],
      },
      {
        path: "subscription",
        select:
          "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
      },
    ],
  });

 // Remove user's ID from the 'users' array in all Skill documents
 await Skill.updateMany({}, { $pull: { users: _id } });

  res.status(200).json({
    status: "success",
    message: "The user was successfully deleted",
    data: { user: userTransformer(deletedUser) },
  });
};

module.exports = remove;
