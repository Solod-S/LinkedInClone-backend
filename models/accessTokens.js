const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const accessTokenSchema = new Schema(
  {
    token: Joi.string().required(),
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: Joi.string().required(),
  },
  { versionKey: false, timestamps: true }
);

accessTokenSchema.post("save", mongooseErrorHandler);

const AccessToken = model("AccessToken", accessTokenSchema);

module.exports = {
  AccessToken,
};
