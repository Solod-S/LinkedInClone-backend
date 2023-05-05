const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/handleMongooseError");

const post = Schema(
  {
    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
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
  },
  { timestamps: true }
);

post.post("save", mongooseErrorHandler);

const Post = model("Post", post);

const postSchema = Joi.object({
  image: Joi.string(),
  video: Joi.string(),
  description: Joi.string().required(),
});

module.exports = {
  Post,
  postSchema,
};