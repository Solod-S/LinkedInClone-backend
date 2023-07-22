const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    avatarURL: { type: Schema.Types.ObjectId, ref: "MediaFile", default: null },
    description: {
      type: String,
      required: true,
      default: "",
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
    },
    location: {
      type: String,
      required: true,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: null,
    },
    foundedYear: {
      type: Number,
      default: null,
    },
    employeesCount: {
      type: Number,
      default: null,
    },
    owners: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    workers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    publications: [{ type: Schema.Types.ObjectId, ref: "Publication" }],
  },
  { versionKey: false, timestamps: true }
);

companySchema.post("save", mongooseErrorHandler);

const Company = model("Company", companySchema);

const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  avatarURL: Joi.string().allow(""),
  description: Joi.string().required(),
  industry: Joi.string()
    .required()
    .valid(
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
      "Other"
    ),
  location: Joi.string().required(),
  website: Joi.string().allow(""),
  email: Joi.string().allow(""),
  phone: Joi.number().allow(""),
  foundedYear: Joi.number().allow(""),
  employeesCount: Joi.number().default(0),
  workers: Joi.array(),
  jobs: Joi.array(),
});

const updateCompanySchema = Joi.object({
  name: Joi.string(),
  avatarURL: Joi.string().allow(""),
  description: Joi.string(),
  industry: Joi.string().valid(
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
    "Other"
  ),
  location: Joi.string(),
  website: Joi.string().allow(""),
  email: Joi.string().allow(""),
  phone: Joi.number().allow(""),
  foundedYear: Joi.number().allow(""),
  employeesCount: Joi.number(),
  workers: Joi.array(),
  jobs: Joi.array(),
})
  .or(
    "name",
    "avatarURL",
    "description",
    "industry",
    "location",
    "website",
    "email",
    "phone",
    "foundedYear",
    "employeesCount",
    "workers",
    "jobs"
  )
  .required();

const companySchemas = {
  createCompanySchema,
  updateCompanySchema,
};

module.exports = {
  Company,
  companySchemas,
};
