const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const emailRegexp = /^\w+([-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatarURL: {
      type: String,
      required: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Array,
      default: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
    },
    posts: {
      type: Array,
      default: [],
    },
    token: {
      type: String,
      default: "",
    },
    verificationCode: {
      type: String,
      default: "",
    },
    resetToken: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseErrorHandler);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const subscribeSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const passwordRestoreSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

const userSchemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscribeSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordRestoreSchema,
};

const User = model("User", userSchema);

module.exports = {
  User,
  userSchemas,
};
