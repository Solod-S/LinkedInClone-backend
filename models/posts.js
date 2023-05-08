const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const postSchema = Schema(
  {
    description: {
      type: String,
      required: true,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
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
