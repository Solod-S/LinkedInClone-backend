const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const languageSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "",
    },
    level: {
      type: String,
      required: true,
      enum: [
        "Elementary proficiency",
        "Limited working proficiency",
        "Professional working proficiency",
        "Full professional proficiency",
        "Native or bilingual proficiency",
      ],
      default: "Elementary proficiency",
    },
  },
  { versionKey: false, timestamps: true }
);

languageSchema.post("save", mongooseErrorHandler);

const Language = model("Language", languageSchema);

const createlanguageSchema = Joi.object({
  language: Joi.string().required(),
  level: Joi.string()
    .required()
    .valid(
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ),
});

const updateLanguageSchema = Joi.object({
  language: Joi.string().required(),
  level: Joi.string()
    .required()
    .valid(
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ),
});

const languagesSchemas = {
  createlanguageSchema,
  updateLanguageSchema,
};

module.exports = {
  Language,
  languagesSchemas,
};
