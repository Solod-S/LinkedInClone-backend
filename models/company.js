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
    logoURL: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    industry: {
      type: String,
      default: "",
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
      required: true,
      default: null,
    },
    owners: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    workers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  },
  { versionKey: false, timestamps: true }
);

companySchema.post("save", mongooseErrorHandler);

const Company = model("Company", companySchema);

const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  logoURL: Joi.string(),
  description: Joi.string().required(),
  industry: Joi.string(),
  location: Joi.string().required(),
  website: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
  foundedYear: Joi.number(),
  employeesCount: Joi.number().required(),
  workers: Joi.array(),
  jobs: Joi.array(),
});

const updateCompanySchema = Joi.object({
  name: Joi.string(),
  logoURL: Joi.string(),
  description: Joi.string(),
  industry: Joi.string(),
  location: Joi.string(),
  website: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
  foundedYear: Joi.number(),
  employeesCount: Joi.number(),
  workers: Joi.array(),
  jobs: Joi.array(),
})
  .or(
    "name",
    "logoURL",
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
