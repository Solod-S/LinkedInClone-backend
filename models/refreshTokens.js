const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const refreshToken = new Schema(
  {
    token: Joi.string().required(),
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: Joi.string().required(),
  },
  { versionKey: false, timestamps: true }
);

refreshToken.post("save", mongooseErrorHandler);

const RefreshToken = model("RefreshToken", refreshToken);

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
  sessionId: Joi.string().required(),
});

module.exports = {
  RefreshToken,
  refreshSchema,
};
