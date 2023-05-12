const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const likeSchema = new Schema(
  {
    type: { type: String, enum: ["like", "dislike"], default: "like", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { versionKey: false, timestamps: true }
);

likeSchema.post("save", mongooseErrorHandler);

const Like = model("Like", likeSchema);

const LikesSchema = Joi.object({
  type: Joi.string().valid("like", "dislike").required(),
  postId: Joi.string().required(),
});

const likeSchemas = {
  LikesSchema,
};

module.exports = {
  Like,
  likeSchemas,
};
