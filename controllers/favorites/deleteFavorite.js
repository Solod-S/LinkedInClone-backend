const { User, Post } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const deleteFavorite = async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;

  const user = await User.findOne({ _id: _id });
  const post = await Post.findById({ _id: postId })
    .populate({
      path: "comments",
      select: "owner description likes mediaFiles createdAt updatedAt",
      populate: [
        {
          path: "owner",
          select:
            "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
        },
        {
          path: "mediaFiles",
          select: "url type providerPublicId location commentId owner createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
        {
          path: "likes",
          select: "owner type createdAt updatedAt",
          populate: {
            path: "owner",
            select:
              "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
          },
        },
      ],
    })
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      },
    })
    .populate({
      path: "likes",
      select: "owner type createdAt updatedAt",
      populate: {
        path: "owner",
        select:
          "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
      },
    })
    .populate({
      path: "owner",
      select:
        "_id surname name avatarURL email subscription favorite posts about education experience frame headLine languages other1 other2 other3 phone site",
    });

  if (!user.favorite.includes(postId)) {
    throw HttpError(404, `Sorry, we couldnt find post id in favorites`);
  }

  if (!post) {
    throw HttpError(404, `Post id is invalid`);
  }

  user.favorite.pull(post._id);
  await user.save();

  res.json({
    status: "success",
    message: "Data successfully removed from your favorites",
    data: { post: postTransformer(post) },
  });
};

module.exports = deleteFavorite;
