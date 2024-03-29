const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const mediaFileSchema = new Schema(
  {
    type: { type: String, enum: ["img", "video"], default: "img" },
    location: {
      type: String,
      enum: ["comments", "posts", "education", "experience", "publications", "users", "companies"],
      default: "posts",
      required: true,
    },
    url: { type: String, required: true },
    providerPublicId: { type: String, default: "null", required: true },
    // this is => cloudinaryResource.public_id,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    educationId: { type: Schema.Types.ObjectId, ref: "Education" },
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience" },
    publicationId: { type: Schema.Types.ObjectId, ref: "Publication" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  { versionKey: false, timestamps: true }
);

mediaFileSchema.post("save", mongooseErrorHandler);

const MediaFile = model("MediaFile", mediaFileSchema);

const mediaFilesSchema = Joi.object({
  type: Joi.string().valid("img", "video").required(),
  location: Joi.string()
    .valid("comments", "posts", "education", "experience", "publications", "users", "companies")
    .required(),
  url: Joi.string().required(),
  providerPublicId: Joi.string().allow(""),
  postId: Joi.string(),
  commentId: Joi.string(),
  educationId: Joi.string(),
  experienceId: Joi.string(),
  publicationId: Joi.string(),
  userId: Joi.string(),
  companyId: Joi.string(),
}).oxor("postId", "commentId", "educationId", "experienceId", "publicationId", "userId", "companyId");

const updateMediaFilesSchema = Joi.object({
  type: Joi.string().valid("img", "video"),
  location: Joi.string().valid("comments", "posts", "education", "experience", "publications", "users", "companies"),
  url: Joi.string(),
  providerPublicId: Joi.string().allow(""),
  postId: Joi.string(),
  commentId: Joi.string(),
  educationId: Joi.string(),
  experienceId: Joi.string(),
  publicationId: Joi.string(),
  userId: Joi.string(),
  companyId: Joi.string(),
})
  .or(
    "type",
    "location",
    "url",
    "providerPublicId",
    "postId",
    "commentId",
    "educationId",
    "experienceId",
    "publicationId",
    "userId",
    "companyId"
  )
  .required();

const mediaFileSchemas = {
  mediaFilesSchema,
  updateMediaFilesSchema,
};

module.exports = {
  MediaFile,
  mediaFileSchemas,
};
