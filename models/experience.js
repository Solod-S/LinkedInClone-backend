const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const experienceSchema = Schema(
  {
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
      required: true,
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
  },
  { versionKey: false, timestamps: true }
);

experienceSchema.post("save", mongooseErrorHandler);

const Experience = model("Experience", experienceSchema);

const createExperienceSchema = Joi.object({
  companyName: Joi.string().required(),
  employmentType: Joi.string()
    .valid("Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship")
    .required(),
  position: Joi.string().required(),
  location: Joi.string(),
  locationType: Joi.string().valid("On-site", "Hybrid", "Remote"),
  startDate: Joi.string(),
  endDate: Joi.string(),
  skills: Joi.array(),
  mediaFiles: Joi.array(),
});

const updateExperienceSchema = Joi.object({
  companyName: Joi.string(),
  employmentType: Joi.string(),
  position: Joi.string(),
  location: Joi.string(),
  locationType: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
  skills: Joi.array(),
  mediaFiles: Joi.array(),
})
  .or(
    "companyName",
    "employmentType",
    "position",
    "location",
    "locationType",
    "startDate",
    "endDate",
    "skills",
    "mediaFiles"
  )
  .required();

const experienceSchemas = {
  createExperienceSchema,
  updateExperienceSchema,
};

module.exports = {
  Experience,
  experienceSchemas,
};
