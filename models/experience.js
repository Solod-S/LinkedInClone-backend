const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const experienceSchema = Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship"],
    default: "Full-time",
  },
  position: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  locationType: {
    type: String,
    enum: ["On-site", "Hybrid", "Remote"],
    default: "On-site",
  },
  startDate: {
    type: Date,
    default: "",
  },
  endDate: {
    type: Date,
    default: "",
  },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  mediaFiles: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
});

experienceSchema.post("save", mongooseErrorHandler);

const Experience = model("Experience", experienceSchema);

const commentsSchema = Joi.object({
  description: Joi.string().required(),
  mediaFiles: Joi.string(),
  postId: Joi.string().required(),
});

const updateComment = Joi.object({
  description: Joi.string(),
  mediaFiles: Joi.string(),
  postId: Joi.string(),
})
  .or("description", "postId", "mediaFiles")
  .required();

const commentSchemas = {
  commentsSchema,
  updateComment,
};

module.exports = {
  Experience,
  commentSchemas,
};
