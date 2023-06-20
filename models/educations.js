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
    grade: {
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
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
  },
  { versionKey: false, timestamps: true }
);

educationsSchema.post("save", mongooseErrorHandler);

const Education = model("educations", educationsSchema);

const createeducationSchema = Joi.object({
  school: Joi.string().required(),
  degree: Joi.string(),
  fieldOfStudy: Joi.string(),
  grade: Joi.string(),
  activitiesAndSocieties: Joi.string(),
  description: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
  mediaFiles: Joi.array(),
});

const updateeducationSchema = Joi.object({
  school: Joi.string(),
  degree: Joi.string(),
  fieldOfStudy: Joi.string(),
  grade: Joi.string(),
  activitiesAndSocieties: Joi.string(),
  description: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
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
    "mediaFiles"
  )
  .required();

const educationsSchemas = {
  createeducationSchema,
  updateeducationSchema,
};

module.exports = {
  Education,
  educationsSchemas,
};
