const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const postSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const createPostSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.array(),
});

const updatecreatePostSchema = Joi.object({
  description: Joi.string(),
  mediaFiles: Joi.array(),
})
  .or("description", "mediaFiles")
  .required();

const postSchemas = {
  createPostSchema,
  updatecreatePostSchema,
};

module.exports = {
  Post,
  postSchemas,
};
