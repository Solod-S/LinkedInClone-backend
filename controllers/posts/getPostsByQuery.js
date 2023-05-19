const { Post } = require("../../models");
const { HttpError } = require("../../routes/errors/HttpErrors");
const { postTransformer } = require("../../helpers/index");

const getPostsByQuery = async (req, res, next) => {
  const { keyWord } = req.params;

  const trimmedKeyWord = keyWord.trim();
  const query = { description: { $regex: trimmedKeyWord, $options: "i" } };
  const posts = await Post.find(query)
    .populate({
      path: "mediaFiles",
      select: "url type providerPublicId",
      populate: { path: "owner", select: "_id name avatarURL" },
    })
    .populate({ path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } })
    .populate({
      path: "comments",
      populate: [
        { path: "owner", select: "_id name avatarURL" },
        { path: "likes", select: "owner type", populate: { path: "owner", select: "_id name avatarURL" } },
        { path: "mediaFiles", select: "url type owner", populate: { path: "owner", select: "_id name avatarURL" } },
      ],
    });

  if (!posts) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    status: "success",
    data: { posts: posts.map((post) => postTransformer(post)) },
  });
};

module.exports = getPostsByQuery;