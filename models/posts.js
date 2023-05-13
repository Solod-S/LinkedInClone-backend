const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const postSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
  },
  { versionKey: false, timestamps: true }
);

postSchema.post("save", mongooseErrorHandler);

const Post = model("Post", postSchema);

const myPostSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.string(),
});

const postSchemas = {
  myPostSchema,
};

module.exports = {
  Post,
  postSchemas,
};
