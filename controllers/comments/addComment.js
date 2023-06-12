const { Comment, Post, MediaFile } = require("../../models");

const { commentTransformer, mediaFileTransformer } = require("../../helpers/index");
const { HttpError } = require("../../routes/errors/HttpErrors");

const addComment = async (req, res, next) => {
  const { _id, name, surname,avatarURL } = req.user;
  const { postId } = req.body;
  const haveMediaFile = req.body.mediaFiles && req.body.mediaFiles.length >0;
  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw HttpError(404, "Not found");
  }
console.log(haveMediaFile, req.body.mediaFiles)
  const mediaFiles = haveMediaFile ? mediaFileTransformer(await MediaFile.findById({_id: req.body.mediaFiles})) : []

  const comment = await Comment.create({
    ...req.body,
    owner: _id,
  });

  console.log(mediaFiles)

  await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });

  res
    .status(201)
    .json({
      status: "success",
      message: "Comment successfully created",
      data: { comment: {...commentTransformer(comment), owner: { _id,
      name,
      surname,
      avatarURL}, mediaFiles} },
    });
};

module.exports = addComment;
