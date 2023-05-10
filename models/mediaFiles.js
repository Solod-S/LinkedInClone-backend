const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const mediaFileSchema = new Schema(
  {
    type: { type: String, enum: ["img", "video"], default: "img" },
    url: { type: String, required: true },
    providerPublicId: { type: String },
    // this is => cloudinaryResource.public_id,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { versionKey: false, timestamps: true }
);

mediaFileSchema.post("save", mongooseErrorHandler);

const MediaFile = model("MediaFile", mediaFileSchema);

const mediaFilesSchema = Joi.object({
  type: Joi.string().valid("img", "video").required(),
  url: Joi.string().required(),
  providerPublicId: Joi.string(),
  postId: Joi.string().required(),
});

const mediaFileSchemas = {
  mediaFilesSchema,
};

module.exports = {
  MediaFile,
  mediaFileSchemas,
};
