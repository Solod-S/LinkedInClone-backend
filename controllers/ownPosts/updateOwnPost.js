const { Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const updateOwnPost = async (req, res, next) => {
  const updateData = req.body; // new data from req.body
  const { _id } = req.user;
  const { postId } = req.params;

  const post = await Post.findById({ _id: postId });

  if (!post || (await post.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true, // return updated post
  })
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

  if (!updatedPost) {
    throw HttpError(404, "Not found");
  }

  res.json({
    status: "success",
    message: "Successfully updated a post",
    data: { post: transformers.postTransformer(updatedPost) },
  });
};

module.exports = updateOwnPost;
