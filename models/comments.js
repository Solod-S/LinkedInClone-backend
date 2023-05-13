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
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { versionKey: false, timestamps: true }
);

commentSchema.post("save", mongooseErrorHandler);

const Comment = model("Comment", commentSchema);

const commentsSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.string(),
  postId: Joi.string().required(),
});

const commentSchemas = {
  commentsSchema,
};

module.exports = {
  Comment,
  commentSchemas,
};
