const { User, Skill, Token, Job, MediaFile, Company, Experience, Education } = require("../../models");

const { userTransformer } = require("../../helpers/index");

const userDelete = async (req, res) => {
  const { _id } = req.user;

  const deletedUser = await User.findOneAndDelete({ _id })
    .populate({
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
    })
    .populate({
      path: "avatarURL",
      select: "url",
    });

  await Token.deleteMany({ owner: _id });
  await Experience.deleteMany({ owner: _id });
  await Education.deleteMany({ owner: _id });
  await MediaFile.deleteOne({ location: "users", owner: _id });
  await Job.updateMany({ applied: { $elemMatch: { $eq: _id } } }, { $pull: { applied: _id } });
  await Skill.updateMany({ users: { $elemMatch: { $eq: _id } } }, { $pull: { users: _id } });
  await Company.updateMany({ workers: { $elemMatch: { $eq: _id } } }, { $pull: { workers: _id } });
  await Company.updateMany({ owners: { $elemMatch: { $eq: _id } } }, { $pull: { owners: _id } });
  await User.updateMany({ subscription: { $elemMatch: { $eq: _id } } }, { $pull: { subscription: _id } });

  res.status(200).json({
    status: "success",
    message: "The user was successfully deleted",
    data: { user: userTransformer(deletedUser) },
  });
};

module.exports = userDelete;
