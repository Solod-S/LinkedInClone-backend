const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      default: "",
    },
    location: Joi.string().valid("posts", "publications").required(),
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    publicationId: { type: Schema.Types.ObjectId, ref: "Publication" },
  },
  { versionKey: false, timestamps: true }
);

commentSchema.post("save", mongooseErrorHandler);

const Comment = model("Comment", commentSchema);

const commentsSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.array(),
  location: Joi.string().required().valid("posts", "publications"),
  postId: Joi.string(),
  publicationId: Joi.string(),
}).oxor("postId", "publicationId");

const updateComment = Joi.object({
  description: Joi.string(),
  mediaFiles: Joi.array(),
  location: Joi.string().valid("posts", "publications"),
  postId: Joi.string(),
  publicationId: Joi.string(),
})
  .or("description", "location", "postId", "mediaFiles", "publicationId")
  .required();

const commentSchemas = {
  commentsSchema,
  updateComment,
};

module.exports = {
  Comment,
  commentSchemas,
};
