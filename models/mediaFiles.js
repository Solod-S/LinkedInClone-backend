const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const mediaFileSchema = new Schema(
  {
    type: { type: String, enum: ["img", "video"], default: "img" },
    location: { type: String, enum: ["comments", "posts"], default: "posts", required: true },
    url: { type: String, required: true },
    providerPublicId: { type: String },
    // this is => cloudinaryResource.public_id,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { versionKey: false, timestamps: true }
);

mediaFileSchema.post("save", mongooseErrorHandler);

const MediaFile = model("MediaFile", mediaFileSchema);

const mediaFilesSchema = Joi.object({
  type: Joi.string().valid("img", "video").required(),
  location: Joi.string().valid("comments", "posts").required(),
  url: Joi.string().required(),
  providerPublicId: Joi.string(),
  postId: Joi.string(),
  commentId: Joi.string(),
});

const updateMediaFilesSchema = Joi.object({
  type: Joi.string().valid("img", "video"),
  location: Joi.string().valid("comments", "posts"),
  url: Joi.string(),
  providerPublicId: Joi.string(),
  postId: Joi.string(),
  commentId: Joi.string(),
})
  .or("type", "location", "url", "providerPublicId", "postId", "commentId")
  .required();

const mediaFileSchemas = {
  mediaFilesSchema,
  updateMediaFilesSchema,
};

module.exports = {
  MediaFile,
  mediaFileSchemas,
};
