const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const publicationSchema = Schema(
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

publicationSchema.post("save", mongooseErrorHandler);

const Publication = model("Publication", publicationSchema);

const createPublicationSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.array(),
});

const updatePublicationSchema = Joi.object({
  description: Joi.string(),
  mediaFiles: Joi.array(),
})
  .or("description", "mediaFiles")
  .required();

const publicationSchemas = {
  createPublicationSchema,
  updatePublicationSchema,
};

module.exports = {
  Publication,
  publicationSchemas,
};
