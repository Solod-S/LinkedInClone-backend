const { Comment, Post, Publication } = require("../../models");

const { transformers } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const addComment = async (req, res, next) => {
  const { _id, name, surname, avatarURL } = req.user;
  const { location, publicationId, postId } = req.body;

  let destinationId = "";
  let model = null;

  switch (location) {
    case "posts":
      destinationId = postId;
      model = Post;
      break;
    case "publications":
      destinationId = publicationId;
      model = Publication;
      break;
    default:
      break;
  }

  const destinationPoint = await model.findById({ _id: destinationId });

  if (!destinationPoint) {
    throw HttpError(404, "Not found");
  }

  const comment = await Comment.create({
    ...req.body,
    owner: _id,
  });

  await model.findByIdAndUpdate(destinationId, { $push: { comments: comment._id } }, { new: true });

  res.status(201).json({
    status: "success",
    message: "Comment successfully created",
    data: { comment: { ...transformers.commentTransformer(comment), owner: { _id, name, surname, avatarURL } } },
  });
};

module.exports = addComment;
