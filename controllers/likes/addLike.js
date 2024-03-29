const { Like, Post, Comment, Publication } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

const addLike = async (req, res, next) => {
  const { _id } = req.user;
  const { location, type, postId, publicationId, commentId } = req.body;

  let mediaFileId = "";
  let model = null;
  let serchParams = "";

  switch (location) {
    case "posts":
      mediaFileId = postId;
      model = Post;
      serchParams = { postId };
      break;
    case "publications":
      mediaFileId = publicationId;
      model = Publication;
      serchParams = { publicationId };
      break;
    case "comments":
      mediaFileId = commentId;
      model = Comment;
      serchParams = { commentId };
      break;
    default:
      break;
  }

  const data = await model.findById({ _id: mediaFileId });

  if (!data) {
    throw HttpError(404, "Not found");
  }
  const likeIsExist = await Like.findOne({ ...serchParams, owner: _id });

  if (likeIsExist) {
    const updatedLike = await Like.findOneAndUpdate({ _id: likeIsExist._id }, { type });

    updatedLike.type = type;

    res
      .status(201)
      .json({
        status: "success",
        message: "Like successfully created",
        data: { like: transformers.likeTransformer(updatedLike) },
      });
  } else {
    const like = await Like.create({
      ...req.body,
      owner: _id,
    });

    await model.findByIdAndUpdate({ _id: mediaFileId }, { $push: { likes: like._id } }, { new: true });

    res
      .status(201)
      .json({
        status: "success",
        message: "Like successfully created",
        data: { like: transformers.likeTransformer(like) },
      });
  }
};

module.exports = addLike;
