const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const educationsSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      default: "",
    },
    fieldOfStudy: {
      type: String,
      default: "",
    },
    activitiesAndSocieties: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
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

educationsSchema.post("save", mongooseErrorHandler);

const Education = model("educations", educationsSchema);

const createEducationSchema = Joi.object({
  school: Joi.string().required(),
  degree: Joi.string().allow(""),
  fieldOfStudy: Joi.string().allow(""),
  grade: Joi.string().allow(""),
  activitiesAndSocieties: Joi.string().allow(""),
  description: Joi.string().allow(""),
  startDate: Joi.string().allow(""),
  endDate: Joi.string().allow(""),
  skills: Joi.array(),
  mediaFiles: Joi.array(),
});

const updateeducationSchema = Joi.object({
  school: Joi.string(),
  degree: Joi.string().allow(""),
  fieldOfStudy: Joi.string().allow(""),
  grade: Joi.string().allow(""),
  activitiesAndSocieties: Joi.string().allow(""),
  description: Joi.string().allow(""),
  startDate: Joi.string().allow(""),
  endDate: Joi.string().allow(""),
  skills: Joi.array(),
  mediaFiles: Joi.array(),
})
  .or(
    "school",
    "degree",
    "fieldOfStudy",
    "grade",
    "activitiesAndSocieties",
    "description",
    "startDate",
    "endDate",
    "skills",
    "mediaFiles"
  )
  .required();

const educationsSchemas = {
  createEducationSchema,
  updateeducationSchema,
};

module.exports = {
  Education,
  educationsSchemas,
};
