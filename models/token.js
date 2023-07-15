const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const tokenSchema = new Schema(
  {
    token: Joi.string().required(),
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { versionKey: false, timestamps: true }
);

tokenSchema.post("save", mongooseErrorHandler);

const Token = model("Token", tokenSchema);

const createTokenSchema = Joi.object({
  token: Joi.string().required(),
  owner: Joi.string().required(),
});

const tokenSchemas = {
  createTokenSchema,
};

module.exports = {
  Token,
  tokenSchemas,
};
