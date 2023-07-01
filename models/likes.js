const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const likeSchema = new Schema(
  {
    type: { type: String, enum: ["like", "dislike"], default: "like", required: true },
    location: Joi.string().valid("comments", "posts", "publications").required(),
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    publicationId: { type: Schema.Types.ObjectId, ref: "Publication" },
  },
  { versionKey: false, timestamps: true }
);

likeSchema.post("save", mongooseErrorHandler);

const Like = model("Like", likeSchema);

const likesSchema = Joi.object({
  type: Joi.string().valid("like", "dislike").required(),
  location: Joi.string().valid("comments", "posts", "publications").required(),
  postId: Joi.string(),
  commentId: Joi.string(),
  publicationId: Joi.string(),
}).oxor("postId", "commentId", "publicationId");

const likeSchemas = {
  likesSchema,
};

module.exports = {
  Like,
  likeSchemas,
};
