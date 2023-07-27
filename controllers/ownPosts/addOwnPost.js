const { Post, User } = require("../../models");

const { transformers } = require("../../helpers/index");

const addOwnPost = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });

  const newPost = await Post.create({
    ...req.body,
    owner: _id,
  });

  user.posts.push(newPost._id);
  await user.save();

  const post = await Post.findById({ _id: newPost._id })
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          populate: {
            path: "avatarURL",
            select: "url",
          },
        },
        {
          path: "mediaFiles",
          select: "url type providerPublicId location commentId owner createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
            populate: {
              path: "avatarURL",
              select: "url",
            },
          },
        },
        {
          path: "likes",
          select: "owner type createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
            populate: {
              path: "avatarURL",
              select: "url",
            },
          },
        },
      ],
    })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId location createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        populate: {
          path: "avatarURL",
          select: "url",
        },
      },
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        populate: {
          path: "avatarURL",
          select: "url",
        },
      },
    })
    .populate({
      path: "owner",
      select:
        "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      populate: {
        path: "avatarURL",
        select: "url",
      },
    });

  res.status(201).json({
    status: "success",
    message: "Post successfully created",
    data: { post: transformers.postTransformer(post) },
  });
};

module.exports = addOwnPost;
