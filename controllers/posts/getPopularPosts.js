const { Post } = require("../../models");

const { postTransformer } = require("../../helpers/index");

const getPopularPosts = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await Post.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await Post.find({})).length <= 0) {
    return res.json({
      status: "success",
      message: "Successfully get popular posts",
      data: {
        posts: [],
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const posts = await Post.find({})
    .sort({ likes: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "comments",
      options: { limit: 10, sort: { createdAt: -1 } },
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

  res.json({
    status: "success",
    message: "Successfully get popular posts",
    data: {
      posts: posts.map((post) => postTransformer(post)),
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getPopularPosts;
