const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const skillSchema = new Schema(
  {
    skill: {
      type: String,
      required: true,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

skillSchema.post("save", mongooseErrorHandler);

const Skill = model("Skill", skillSchema);

const skillsSchema = Joi.object({
  skill: Joi.string().required(),
});

const skillsSchemas = {
  skillsSchema,
};

module.exports = {
  Skill,
  skillsSchemas,
};
