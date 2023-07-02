const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const jobSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship"],
      required: true,
      default: "Full-time",
    },
    seniorityLevel: {
      type: String,
      enum: [
        "Internship",
        "Entry Level",
        "Junior",
        "Mid Level",
        "Senior",
        "Lead",
        "Manager",
        "Director",
        "Executive",
        "C-Level",
        "Other",
      ],
      required: true,
      default: "Other",
    },
    industry: {
      type: String,
      enum: [
        "Information Technology (IT)",
        "Finance and Banking",
        "Healthcare and Medicine",
        "Manufacturing and Industrial",
        "Tourism and Hospitality",
        "Education and Science",
        "Retail",
        "Marketing and Advertising",
        "Arts and Entertainment",
        "Automotive Industry",
        "E-commerce",
        "Other",
      ],
      required: true,
      default: "Other",
    },
    applyURL: {
      type: String,
      default: "",
    },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    applied: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { versionKey: false, timestamps: true }
);

jobSchema.post("save", mongooseErrorHandler);

const Job = model("Job", jobSchema);

const createJobSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().allow(""),
  description: Joi.string().required(),
  employmentType: Joi.string().required(),
  seniorityLevel: Joi.string().required(),
  industry: Joi.string().required(),
  applyURL: Joi.string().allow(""),
  skills: Joi.array(),
});

const updateJobSchema = Joi.object({
  description: Joi.string(),
  mediaFiles: Joi.array(),
  skills: Joi.array(),
})
  .or("description", "mediaFiles")
  .required();

const JobSchemas = {
  createJobSchema,
  updateJobSchema,
};

module.exports = {
  Job,
  JobSchemas,
};
