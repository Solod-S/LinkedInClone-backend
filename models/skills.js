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
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { versionKey: false, timestamps: true }
);

skillSchema.post("save", mongooseErrorHandler);

const Skill = model("Skill", skillSchema);

const createSkillSchema = Joi.object({
  skill: Joi.string().required(),
});

const updateSkillSchema = Joi.object({
  skill: Joi.string(),
});

const skillsSchemas = {
  createSkillSchema,
  updateSkillSchema,
};

module.exports = {
  Skill,
  skillsSchemas,
};
